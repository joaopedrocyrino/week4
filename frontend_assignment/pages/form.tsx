import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import styles from "../styles/Form.module.css"
import { Input } from '../components'
import { providers, Contract } from "ethers"
import Greeter from "artifacts/contracts/Greeters.sol/Greeters.json"

const contractAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'

const provider = new providers.JsonRpcProvider("http://localhost:8545")
const contract = new Contract(contractAddress, Greeter.abi, provider)

const Form: React.FC = () => {
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<number>(0)
    const [address, setAddress] = useState<string>('')
    const [greeting, setGreeting] = useState<string>('')
    const [err, setErr] = useState<{
        name?: boolean,
        age?: boolean,
        address?: boolean
    }>({})

    const isValidSchema = async (value: any, schema: any): Promise<boolean> => {
        return await yup.object({
            value: schema ?? yup.string().required()
        }).isValid({ value: value === '' ? undefined : value })
    }

    const onSubmit = async () => {
        const obj = { name, age, address }

        let isValid: boolean = true
        await Promise.all(Object.keys(obj).map(async (k) => {
            const key = k as 'age' | 'address' | 'name'

            const valid = await isValidSchema(
                obj[key],
                k === 'age' ?
                    yup.number().required().positive().integer().max(130)
                    :
                    undefined
            )

            if (valid) { err[key] = false } else {
                isValid = false
                err[key] = true
            }

            setErr({ ...err })
        }))

        if (isValid) { console.log(JSON.stringify(obj)) }
    }

    useEffect(() => {
        contract.on('NewGreeting', (res: any) => {
            if (res) {
                setGreeting(res)
            }
        })

        return () => {
            contract.removeAllListeners('NewGreeting')
        }
    }, [])

    return (
        <div className={styles.container}>
            <Input
                value={name}
                setValue={setName}
                placeHolder='Name'
                err={err.name}
            />
            <Input
                value={age}
                setValue={setAge}
                placeHolder='Age'
                type='number'
                err={err.age}
            />
            <Input
                value={address}
                setValue={setAddress}
                placeHolder='Address'
                err={err.address}
            />
            <button className={styles.button} onClick={onSubmit}>Submit</button>
            <p style={{ color: 'black' }}>New Greeting: {greeting}</p>
        </div>
    )
}

export default Form
