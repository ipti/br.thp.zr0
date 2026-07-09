"use client"

import { Dispatch, SetStateAction } from "react"
import { AddCartItemRequest, GetMyCartRequest, GetProductByUidRequest, LoginRequest } from "./request"
import { LoginTypes } from "./types"
import { login } from "@/service/localstorage"
import { useNavigation } from "@/utils/navigation"
import Cookies from 'js-cookie';
import { PerfisEnum } from "@/utils/enum/perfis"
import { useCartStore } from "@/service/store/cart_store"

export function LoginController(setErros: Dispatch<SetStateAction<string>>) {

    const exp90 = new Date()
    exp90.setMinutes(exp90.getMinutes() + 90)

    const history = useNavigation()
    const setCart = useCartStore(state => state.setCart)

    async function syncLocalCartToApi() {
        const localCart = useCartStore.getState().cart

        for (const item of localCart) {
            const productResponse = await GetProductByUidRequest(item.id)
            await AddCartItemRequest({
                productId: productResponse.data.id,
                quantity: item.quantity,
                variantId: item.variantId,
            })
        }

        const apiCart = await GetMyCartRequest()
        const syncedItems = (apiCart.data?.items ?? []).map((item: any) => ({
            id: item.product.uid,
            cartItemId: item.id,
            name: item.product.name,
            price: item.product.price ?? 0,
            quantity: item.quantity,
            image: item.product.product_image?.[0]?.img_url ?? '',
            variantId: item.variant_fk ?? undefined,
        }))

        setCart(syncedItems)
    }

    function LoginAction(body: LoginTypes, handleReturn?: () => void) {
        LoginRequest(body).then(async data => {
            setErros("")
            Cookies.set('access_token', data.data.access_token, { expires: exp90 })
            login(data.data.access_token);
            await syncLocalCartToApi()
            handleReturn && handleReturn()
            if (data.data.userRegistered.role === PerfisEnum.CUSTOMER) {
                history.history.push("/")
            } else {
                history.history.push("/seller/home")
            }
            // window.location.reload()
            // history.history.push("/")
        }).catch(erros => {
            handleReturn && handleReturn()
            console.log(erros.response.data.message)
            setErros(erros.response.data.message)
        })
    }

    function LoginModalAction(body: LoginTypes, handleReturn?: () => void) {
        LoginRequest(body).then(async data => {
            setErros("")
            handleReturn && handleReturn()
            Cookies.set('access_token', data.data.access_token, { expires: exp90 })
            login(data.data.access_token);
            await syncLocalCartToApi()
            window.location.reload()
            // history.history.push("/")
        }).catch(erros => {
            console.log(erros.response.data.message)
            handleReturn && handleReturn()
            setErros(erros.response.data.message)
        })
    }

    
    function LoginCartAction(body: LoginTypes, handleActiveIndex: (i: number) => void) {
        LoginRequest(body).then(async data => {
            setErros("")
            Cookies.set('access_token', data.data.access_token, { expires: exp90 })
            login(data.data.access_token);
            await syncLocalCartToApi()
            handleActiveIndex(2)
            // if (data.data.userRegistered.role === PerfisEnum.CUSTOMER) {
            //     history.history.push("/")
            // } else {
            //     history.history.push("/seller/home")
            // }
            // window.location.reload()
            // history.history.push("/")
        }).catch(erros => {
            console.log(erros.response.data.message)
            setErros(erros.response.data.message)
        })
    }
    return {
        LoginAction, LoginCartAction, LoginModalAction
    }
}
