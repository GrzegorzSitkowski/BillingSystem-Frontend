import { hash } from 'ohash'

export const useWebApiFetch = function (request, opts) {
    const config = useRuntimeConfig()

    return useFetch(request, {baseUrl: config.public.BASE_URL,
    onRequest({request, options }){

    },
    onRequestError(context){

    },
    onResponse({request, response, options}){

    },
    onResponseError({request, response, options}) {

    },
    credentials: 'include',
    key: hash(['webapi-fetch', request, opts?.body, opts?.params, opts?.method, opts?.query]),
    ...opts});
}