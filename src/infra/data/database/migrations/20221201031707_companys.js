
exports.up = async function (knex) {
    knex.schema.hasTable('companys')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('companys', function (table) {
                    table.string('id').primary()
                    table.string('name')
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('companys')
}
