
const x = {
  id: 'x',
  name: 'x',
  validTypes: ['number', 'date'],
  required: true,
  operation: 'get',

}

const y = {
  id: 'y',
  name: 'y',
  validTypes: ['number', 'date'],
  required: true,
  operation: 'get',

}

const group = {
  id: 'group',
  name: 'group',
  validTypes: [Number, Date],
  required: true,
  operation: 'group',
}

const groupAgg = {
  id: 'groupAgg',
  name: 'groupAgg',
  validTypes: ["number", "date"],
  required: true,
  operation: 'groupAggregate',

}


export const dispersionMapper = [x, y]

export const groupMapper = [group, x, y]

export const groupAggregateMapper = [groupAgg, x, y]