const { getAllPaths, hasAccess, getUserPaths } = require('./')

// Paths and access levels
const registry = [
  {
    path: '/',
    parent: null,
    level: 1
  },
  {
    path: '/projects',
    parent: '/',
    level: 100
  },
  {
    path: '/photos',
    parent: '/',
    level: 200
  },
  {
    path: '/laboratory',
    parent: '/projects',
    level: 200
  },
  {
    path: '/john',
    parent: '/projects',
    level: 299
  },
  {
    path: '/secret',
    parent: '/projects',
    level: 999
  },
  {
    path: '/rocket',
    parent: '/secret',
    level: 10
  },
]


// Users with their access level
const users = [
  {
    name: 'superadmin',
    level: 1000
  },
  {
    name: 'guest',
    level: 201
  },
  {
    name: 'john',
    level: 301
  }
]

describe('PayFit Onsite Challenge', () => {
  describe('Get all paths', () => {
      const paths = getAllPaths(registry)

      const availablePaths = [
        '/',
        '/projects',
        '/photos',
        '/projects/laboratory',
        '/projects/john',
        '/projects/secret',
        '/projects/secret/rocket',
      ]
      it('should have correct length', () => {
        expect(paths).toHaveLength(7)
      })

      availablePaths.forEach(path => {
        it(`should return the path ${path}`, () => {
          expect(paths.find(p => p.absolutePath === path)).toBeTruthy()
        })
      })
  })

  describe('Check user access should return true when we have the right level', () => {
    const paths = getAllPaths(registry)

    describe('superadmin', () => {
      const superadmin = users[0]

      const testCases = [
        { input: '/', expected: true},
        { input: '/photos', expected: true},
        { input: '/projects', expected: true},
        { input: '/projects/laboratory', expected: true},
        { input: '/projects/john', expected: true},
        { input: '/projects/secret', expected: true},
        { input: '/projects/secret/rocket', expected: true},
      ]

      testCases.forEach(({ input, expected }) => {
        it(`hasAccess of "${input}" should be ${expected}`, () => {
          expect(hasAccess(superadmin, input, paths)).toBe(expected)
        })
      })
    })

    describe('guest', () => {

      const testCases = [
        { input: '/', expected: true},
        { input: '/photos', expected: true},
        { input: '/projects', expected: true},
        { input: '/projects/laboratory', expected: true},
        { input: '/projects/john', expected: false},
        { input: '/projects/secret', expected: false},
        { input: '/projects/secret/rocket', expected: false},
      ]

      const guest = users[1]

      testCases.forEach(({ input, expected }) => {
        it(`hasAccess of "${input}" should be ${expected}`, () => {
          expect(hasAccess(guest, input, paths)).toBe(expected)
        })
      })
    })

    describe('john', () => {
      const testCases = [
        { input: '/', expected: true},
        { input: '/photos', expected: true},
        { input: '/projects', expected: true},
        { input: '/projects/laboratory', expected: true},
        { input: '/projects/john', expected: true},
        { input: '/projects/secret', expected: false},
        { input: '/projects/secret/rocket', expected: false},
      ]
      const john = users[2]

      testCases.forEach(({ input, expected }) => {
        it(`hasAccess of "${input}" should be ${expected}`, () => {
          expect(hasAccess(john, input, paths)).toBe(expected)
        })
      })
    })
  })

  describe('Get all the user possibilities', () => {
    it('should return all paths for: superadmin', () => {
      const paths = getAllPaths(registry)

      const superadmin = users[0]

      const availablePaths = getUserPaths(superadmin, paths)

      expect(availablePaths).toHaveLength(7)

      availablePaths.forEach(path => {
        expect(hasAccess(superadmin, path.absolutePath, paths)).toBe(true)
      })
    })

    it('should return all paths for: guest', () => {
      const paths = getAllPaths(registry)

      const guest = users[1]

      const availablePaths = getUserPaths(guest, paths)

      expect(availablePaths).toHaveLength(4)

      availablePaths.forEach(path => {
        expect(hasAccess(guest, path.absolutePath, paths)).toBe(true)
      })
    })

    it('should return all paths for: john', () => {
      const paths = getAllPaths(registry)

      const john = users[2]

      const availablePaths = getUserPaths(john, paths)

      expect(availablePaths).toHaveLength(5)

      availablePaths.forEach(path => {
        expect(hasAccess(john, path.absolutePath, paths)).toBe(true)
      })
    })
  })
})
