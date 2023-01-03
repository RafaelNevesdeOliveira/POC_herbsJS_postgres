const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Company = require('../../entities/company')
const CompanyRepository = require('../../../infra/data/repositories/companyRepository')

const dependency = { CompanyRepository }

const createCompany = injection =>
  usecase('Create Company', {
    // Input/Request metadata and validation 
    request: request.from(Company, { ignoreIDs: true }),

    // Output/Response metadata
    response: Company,

    //Authorization with Audit
    // authorize: (user) => (user.canCreateCompany ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    //Step description and function
    'Check if the Company is valid': step(ctx => {
      ctx.company = Company.fromJSON(ctx.req)
      ctx.company.id = Math.floor(Math.random() * 100000).toString()
      
      if (!ctx.company.isValid()) 
        return Err.invalidEntity({
          message: 'The Company entity is invalid', 
          payload: { entity: 'Company' },
          cause: ctx.company.errors 
        })

      // returning Ok continues to the next step. Err stops the use case execution.
      return Ok() 
    }),

    'Save the Company': step(async ctx => {
      const repo = new ctx.di.CompanyRepository(injection)
      const company = ctx.company
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.insert(company))
    })
  })

module.exports =
  herbarium.usecases
    .add(createCompany, 'CreateCompany')
    .metadata({ group: 'Company', operation: herbarium.crud.create, entity: Company })
    .usecase