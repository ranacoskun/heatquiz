import { useCallback, useEffect, useState } from "react"
import { AxiosError } from "axios"

export function useAsync(func, dependencies = []) {
  const { execute, ...state } = useAsyncInternal(func, dependencies, true)

  useEffect(() => {
    execute()
  }, [execute])

  return state
}

export function useAsyncFn(func, dependencies = []) {
  return useAsyncInternal(func, dependencies, false)
}

function useAsyncInternal(func, dependencies, initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState()
  const [value, setValue] = useState()

  const execute = useCallback((...params) => {

    setLoading(true)

    return func(...params)
      .then(res => {
        console.log(res)
        const isError = (res instanceof AxiosError)

        if(isError){
          setValue(null)

          let msg = ""

          if(res.response){
            const {data} = res.response

            setError(data)

            msg = data
          }
          else{
            const {message} = res
            setError(message)

            msg = message

          }
          
          return ({error: msg})
        }

        else{
          setError(null)
          const {data} = res

          setValue(data)

          return ({data})
        }
      })
      .catch(error => {
        setError(error)
        setValue(null)
        return Promise.reject(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, dependencies)

  return { loading, error, value, execute }
}