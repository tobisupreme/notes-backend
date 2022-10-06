const { average } = require('../utils/for_testing')

describe('average', () => {
  test('of one value is the value itself', () => {
    expect(average([4])).toBe(4)
  })

  test('of many is calculated right', () => {
    expect(average([2, 4, 5, 9])).toBe(5)
  })

  test('of empty array is 0', () => {
    expect(average([])).toBe(0)
  })
})
