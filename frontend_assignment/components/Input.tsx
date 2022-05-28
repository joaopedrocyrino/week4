import React, { useState } from 'react'
import styles from '../styles/Input.module.css'

const Input: React.FC<{
    placeHolder: string,
    type?: 'number',
    value: any,
    setValue: (v: any) => void,
    err?: boolean
}> = ({ placeHolder, type, value, setValue, err }) => {
    const [isFocus, setIsFocus] = useState<boolean>(false);

    const onChange = (eventValue: any) => {
        let newValue = eventValue
        if (type) {
            newValue = Number(newValue)

            if (newValue > 130) { newValue = 130 }
            else if (newValue < 0) { newValue = 0 }
        }
        setValue(newValue)
    }

    return (
        <div
            className={styles.inputWrapper}
        >
            <p className={`${styles.placeHolder} ${isFocus ? `${styles.placeHolderFocus}` : ''}`} >{placeHolder}</p>
            <input
                className={`${styles.input} ${err ? `${styles.errInput}`: ''}`}
                onFocus={() => setIsFocus(true)}
                type={type}
                min={type ? 0 : undefined}
                max={type ? 130 : undefined}
                value={isFocus ? value : ''}
                onChange={({ target }) => onChange(target.value)}
            />
            <p className={`${styles.errMsg} ${err ? `${styles.errShow}` : ''}`}>Invalid value for this field!</p>
        </div>
    )
}

export default Input
