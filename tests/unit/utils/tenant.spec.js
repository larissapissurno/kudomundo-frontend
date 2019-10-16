describe('tenant', () => {
  let tenantLocal
  let tenantOther

  beforeAll(() => {
    global.window = Object.create(window)

    // jest.isolateModules(() => {
    //     const host = "mytenant.kudomundo.ml";
    //     Object.defineProperty(window, 'location', {
    //         value: { host }
    //     });
    //     tenantOther = require('@/tenant')
    // })

    const host = 'localhost'
    Object.defineProperty(window, 'location', {
      value: { host }
    })
    tenantLocal = require('@/tenant')
  })

  it('shoud be dsv when host is localhost', () => {
    const tenant = tenantLocal

    expect(tenant.team).toBe('bebulls')
    expect(tenant.uri).toBe('http://localhost:3000')
  })

  xit('shoud not be dsv when host has tenant', () => {
    const tenant = tenantOther
    expect(tenant.team).toBe('mytenant')
    expect(tenant.uri).toBe('https://xzmw17xdji.execute-api.us-east-1.amazonaws.com/dev')
  })

  it('shoud inject customcss', () => {
    const tenant = tenantLocal

    const cssId = 'plcss'
    expect(document.getElementById(cssId)).toBeNull()
    tenant.importCustomCss()

    expect(document.getElementById(cssId)).toBeTruthy()
    tenant.importCustomCss()

    expect(document.getElementById(cssId)).toBeTruthy()
  })
})
