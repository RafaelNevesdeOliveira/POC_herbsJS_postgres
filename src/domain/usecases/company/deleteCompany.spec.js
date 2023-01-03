const Company = require('../../entities/company')
const deleteCompany = require('./deleteCompany')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteCompanySpec = spec({

    usecase: deleteCompany,
  
    'Delete company if exists': scenario({
      'Given an existing company': given({
        request: {
            id: 'a text'
        },
        user: { hasAccess: true },
        injection:{
            CompanyRepository: class CompanyRepository {
                async delete(entity) { return true }
                async findByID(id) { return [Company.fromJSON({ id })] }            }
        },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must confirm deletion': check((ctx) => {
        assert.ok(ctx.response.ok === true)
      })

    }),

    'Do not delete company if it does not exist': scenario({
        'Given an empty company repository': given({
          request: {
              id: 'a text'
          },
          user: { hasAccess: true },
          injection:{
            CompanyRepository: class CompanyRepository {
              async findByID(id) { return [] }
            }
          },
        }),
  
        // when: default when for use case
  
        'Must return an error': check((ctx) => {
          assert.ok(ctx.response.isErr)
          assert.ok(ctx.response.isNotFoundError)  
        }),
      }),
  })
  
module.exports =
  herbarium.specs
    .add(deleteCompanySpec, 'DeleteCompanySpec')
    .metadata({ usecase: 'DeleteCompany' })
    .spec