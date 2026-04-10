import { describe, it, expect, beforeEach, vi } from 'vitest'
import { async } from './main'

describe('async/await simulation with generators', () => {
    describe('async wrapper function', () => {
        it('should execute a simple generator function', async () => {
            const generatorFunc = function* (): Generator<
                never,
                number,
                never
            > {
                return 42
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            expect(result).toBe(42)
        })

        it('should accept arguments', async () => {
            const generatorFunc = function* (
                a: number,
                b: number,
            ): Generator<never, number, never> {
                return a + b
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc(10, 20)

            expect(result).toBe(30)
        })

        it('should handle yielded promises', async () => {
            const generatorFunc = function* (): Generator<
                Promise<number>,
                number,
                number
            > {
                const value = yield Promise.resolve(42)
                return value
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            // Проверяем, что функция выполняется и возвращает значение
            expect(result).toBeDefined()
        })

        it('should handle multiple yields', async () => {
            const generatorFunc = function* (): Generator<
                Promise<number>,
                number,
                number
            > {
                const a = yield Promise.resolve(10)
                const b = yield Promise.resolve(20)
                return a
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            expect(result).toBeDefined()
        })

        it('should handle synchronous yields', async () => {
            const generatorFunc = function* (): Generator<
                number,
                number,
                number
            > {
                const value = yield 100
                return value
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            expect(result).toBeDefined()
        })

        it('should work with string yields', async () => {
            const generatorFunc = function* (): Generator<
                Promise<string>,
                string,
                string
            > {
                return yield Promise.resolve('test string')
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            expect(result).toBeDefined()
        })

        it('should handle object yields', async () => {
            const generatorFunc = function* (): Generator<
                Promise<{ key: string }>,
                { key: string },
                { key: string }
            > {
                const obj = yield Promise.resolve({ key: 'value' })
                return obj
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            expect(result).toBeDefined()
        })

        it('should handle delayed promises', async () => {
            const delayedPromise = new Promise((resolve) => {
                setTimeout(() => resolve('delayed'), 50)
            })

            const generatorFunc = function* (): Generator<
                Promise<unknown>,
                unknown,
                unknown
            > {
                const value = yield delayedPromise
                return value
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            expect(result).toBeDefined()
        })

        it('should handle multiple function calls independently', async () => {
            const generatorFunc = function* (
                multiplier: number,
            ): Generator<Promise<number>, number, number> {
                const base = yield Promise.resolve(10)
                return base * multiplier
            }

            const asyncFunc = async(generatorFunc)
            const result1 = await asyncFunc(2)
            const result2 = await asyncFunc(3)

            expect(result1).toBeDefined()
            expect(result2).toBeDefined()
        })

        it('should handle empty generator', async () => {
            const generatorFunc = function* (): Generator<never, void, never> {
                // empty generator
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            expect(result).toBeUndefined()
        })

        it('should handle generator with only yield (no return)', async () => {
            const generatorFunc = function* (): Generator<
                Promise<number>,
                void,
                void
            > {
                yield Promise.resolve(42)
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc()

            expect(result).toBeUndefined()
        })

        it('should return a function that can be called multiple times', async () => {
            const generatorFunc = function* (): Generator<
                never,
                number,
                never
            > {
                return 5
            }

            const asyncFunc = async(generatorFunc)

            const result1 = await asyncFunc()
            const result2 = await asyncFunc()
            const result3 = await asyncFunc()

            expect(result1).toBe(5)
            expect(result2).toBe(5)
            expect(result3).toBe(5)
        })

        it('should handle generator with different argument types', async () => {
            const generatorFunc = function* (
                str: string,
                num: number,
                obj: Record<string, unknown>,
            ): Generator<
                Promise<string | number>,
                Record<string, unknown>,
                string | number
            > {
                yield Promise.resolve(str)
                yield Promise.resolve(num)
                return obj
            }

            const asyncFunc = async(generatorFunc)
            const result = await asyncFunc('test', 42, { key: 'value' })

            expect(result).toBeDefined()
        })

        it('should handle immediate promise resolution', async () => {
            const generatorFunc = function* (): Generator<
                Promise<number>,
                number,
                number
            > {
                const val = yield Promise.resolve(99)
                return val
            }

            const asyncFunc = async(generatorFunc)
            const startTime = Date.now()
            const result = await asyncFunc()
            const endTime = Date.now()

            // Should complete reasonably fast for immediate resolution
            expect(endTime - startTime).toBeLessThan(1000)
            expect(result).toBeDefined()
        })

        it('f test', async () => {
            function wait(time: number) {
                return new Promise((res) => setTimeout(res, time))
            }

            const f = async(function* () {
                yield wait(1000)

                const n: number = yield Promise.resolve(Promise.resolve(500))

                return Promise.resolve(n + (yield Promise.resolve(100)))
            })

            const start = Date.now()
            const promise = f()
            const res = await promise
            const end = Date.now()

            expect(end - start).toBeGreaterThanOrEqual(1000)
            expect(res).toBe(600)

            promise.then((res) => expect(res).toBe(600))
        })
    })
})
