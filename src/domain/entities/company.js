const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Company =
        entity('Company', {
          id: id(String),
          name: field(String),
        })

module.exports =
  herbarium.entities
    .add(Company, 'Company')
    .entity
