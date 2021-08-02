import React, { ReactElement } from 'react'
import CodeEditor from '../../components/CodeEditor'
import Paperbase from "../../components/Paperbase";

interface Props {
    
}

function Functions({}: Props): ReactElement {
    return (
        <Paperbase>
            <CodeEditor/>
        </Paperbase>
    )
}

export default Functions
