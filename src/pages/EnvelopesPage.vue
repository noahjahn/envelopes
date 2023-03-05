<template>
  <q-page padding>
    <div class="q-mb-md">
      <q-btn label="Add new envelope" color="primary" @click="addEnvelope" />
    </div>
    <q-table
      class="my-sticky-dynamic"
      hide-bottom
      style="background-color: var(--q-dark-page); border-radius: 10px"
      ref="envelopesTable"
      :rows="rows"
      :columns="columns"
      row-key="name"
      binary-state-sort
      v-model:pagination="pagination"
      virtual-scroll
      dense
      flat
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">
            {{ props.row.name }}
            <q-popup-edit
              auto-save
              v-model="props.row.name"
              @save="(value) => persistEnvelopeByName(value, props.row)"
              v-slot="scope"
            >
              <q-input
                tabindex="1"
                v-model="scope.value"
                dense
                autofocus
                counter
                @keyup.enter="scope.set"
                @keyup.tab="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="planned" :props="props">
            {{ formatCurrency(props.row.planned) }}
            <q-popup-edit
              v-model="props.row.planned"
              @save="
                  (value: string) =>
                    persistEnvelopeByPlanned(parseFloat(value), props.row)
                "
              v-slot="scope"
            >
              <q-input
                type="number"
                v-model="scope.value"
                dense
                autofocus
                tabindex="1"
                @keyup.enter="scope.set"
                @keyup.tab="scope.set"
              />
            </q-popup-edit>
          </q-td>
          <q-td key="starting" :props="props">
            {{ formatCurrency(props.row.starting) }}
          </q-td>
          <q-td key="actual" :props="props">
            {{ formatCurrency(props.row.actual) }}
          </q-td>
          <q-td
            :class="
              props.row.planned + props.row.starting - props.row.actual < 0
                ? 'text-negative'
                : props.row.planned + props.row.starting - props.row.actual ===
                  0
                ? ''
                : 'text-positive'
            "
            key="difference"
            :props="props"
          >
            {{
              formatCurrency(
                props.row.planned + props.row.starting - props.row.actual,
              )
            }}
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn
              @click="deleteEnvelope($event, props.row)"
              flat
              rounded
              icon="delete"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { QTableProps } from 'quasar';
import envelopes from 'src/envelopes';
import { Envelope } from 'src/envelopes/index';
import { useQuasar } from 'quasar';

function formatCurrency(amount: number | string) {
  if (typeof amount === 'string') {
    amount = parseFloat(amount);
  }
  if (amount < 0) {
    return `(${Math.abs(amount).toFixed(2)})`;
  }
  return `${amount.toFixed(2)}`;
}
const headerClasses = 'bg-dark';
const headerStyle = `
font-size: 0.875rem;
font-weight: 600;
line-height: 2.5rem;
letter-spacing: 0.00735em;
`;

// INFO: interestingly, this type definition is required, other was type script complains where it's used in the table
const columns: QTableProps['columns'] = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
    sortOrder: 'ad',
    headerClasses,
    headerStyle,
  },
  {
    name: 'planned',
    align: 'right',
    label: 'Planned',
    field: 'planned',
    headerClasses,
    headerStyle,
  },
  {
    name: 'starting',
    align: 'right',
    label: 'Starting',
    field: 'starting',
    headerClasses,
    headerStyle,
  },
  {
    name: 'actual',
    align: 'right',
    label: 'Actual',
    field: 'actual',
    headerClasses,
    headerStyle,
  },
  {
    // INFO: omitting field here, since we're custom rendering the table body. https://stackoverflow.com/a/75623507/15308357
    name: 'difference',
    align: 'right',
    label: 'Difference',
    field: (envelope: Envelope) =>
      envelope.planned + envelope.starting - envelope.actual,
    headerClasses,
    headerStyle,
  },
  {
    name: 'actions',
    align: 'right',
    label: '',
    field: '',
    headerClasses,
    headerStyle,
  },
];

export default defineComponent({
  name: 'EnvelopesPage',
  async setup() {
    const $q = useQuasar();
    const envelopesTable = ref();
    const pagination = ref({
      page: 1,
      rowsPerPage: 10,
    });

    const rows = ref<Array<Envelope>>([]);

    async function listEnvelopes() {
      rows.value = await envelopes.envelopes().list();
      pagination.value.rowsPerPage = rows.value.length;
    }

    onMounted(() => {
      // INFO: envelopesTable.value is undefined until the page is mounted..
      envelopesTable.value.sort('name');
    });

    await listEnvelopes();

    return {
      columns,
      rows,
      addEnvelope: () => {
        rows.value.push({
          uuid: '',
          name: '',
          planned: 0.0,
          starting: 0.0,
          actual: 0.0,
        });
        pagination.value.rowsPerPage++;
      },
      persistEnvelopeByName: async (name: string, envelope: Envelope) => {
        envelope.name = name;
        if (envelope.uuid === '') {
          delete envelope.uuid;
          envelope.uuid = (await envelopes.envelopes().create(envelope)).uuid;
          return;
        }

        if (envelope.uuid !== undefined) {
          await envelopes.envelopes().update(envelope.uuid, envelope);
          return;
        }
        throw new Error('Envelope has an invalid uuid');
      },
      persistEnvelopeByPlanned: async (planned: number, envelope: Envelope) => {
        if (envelope.uuid === '') {
          $q.notify({
            type: 'negative',
            message: 'A name for this envelope is required before saving',
          });
          return;
        }
        if (envelope.uuid !== undefined) {
          envelope.planned = planned;
          await envelopes.envelopes().update(envelope.uuid, envelope);
          await listEnvelopes();
          return;
        }
        throw new Error('Envelope has an invalid uuid');
      },
      deleteEnvelope: async (event: Event, envelope: Envelope) => {
        if (envelope.uuid !== undefined) {
          await envelopes.envelopes().delete(envelope.uuid);
          await listEnvelopes();
          return;
        }
        throw new Error('Envelope has an invalid uuid');
      },
      pagination,
      formatCurrency,
      envelopesTable,
      vslotBody: (props: QTableProps) => {
        return {
          ...props,
          color: 'primary',
        };
      },
    };
  },
});
</script>

<style lang="sass">
.my-sticky-dynamic
  /* height or max-height is important */
  max-height: 75vh

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>
