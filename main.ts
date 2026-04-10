const promiseDeployment = (newValue: unknown, gen: Generator) => {
    return new Promise((res) => {
        if (newValue instanceof Promise) {
            newValue.then((value) => {
                promiseDeployment(value, gen).then(res)
            })
        }

        res(newValue)
    })
}

export function async<ReturnT extends Generator, Args extends unknown[]>(
    callback: (...args: Args) => ReturnT,
) {
    return (...args: Args): Promise<unknown> => {
        const generator = callback(...args)

        return new Promise((res, rej) => {
            function handleResult(result: IteratorResult<unknown>) {
                if (result.done) {
                    res(result.value)
                    return
                }

                promiseDeployment(result.value, generator)
                    .then((value) => {
                        handleResult(generator.next(value))
                    })
                    .catch(rej)
            }

            handleResult(generator.next())
        })
    }
}
