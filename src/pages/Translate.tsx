import React, {useState} from "react";
import {Col, Row} from "antd";
import {useMessage} from "../hooks/useMessage";
import copy from 'copy-to-clipboard';
import Button from "../models/components/Button";
import {CardContent, TextField, Typography} from "@mui/material";
import Card from "@mui/material/Card";
import LoginWrapper from "../modules/LoginWrapper/LoginWrapper";
import {defineMessages, useIntl} from "react-intl";


const messages = defineMessages({
    copy: {
        id: 'btn.copy',
    },
    placeholder: {
        id: 'home.input-placeholder',
    },
    btn: {
        id: 'home.translate-btn',
    },
});
const Translate = () => {
    const [data, setData] = useState<string>();
    const {run, message, loading} = useMessage();
    const intl = useIntl();
    return (
        <>
            <Row gutter={12} style={{
                margin: 12,
            }}>
                <Col span={12} style={{
                    marginTop: 12
                }}>
                    <div>
                        <TextField
                            label={intl.formatMessage(messages.placeholder)}
                            onChange={(e) => {
                                setData(e?.target?.value)
                            }}
                            rows={18}
                            fullWidth
                            variant="filled"
                            multiline
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <div style={{textAlign: 'center', marginBottom: 10}}>
                        <LoginWrapper>
                            <Button variant="contained" loading={loading} type="primary" onClick={async () => {
                                data && await run(data);
                            }}>{intl.formatMessage(messages.btn)}</Button>
                        </LoginWrapper>
                    </div>
                    <Card>
                        <CardContent style={{
                            minHeight: 340,
                        }}>
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                {message}
                            </Typography>
                        </CardContent>
                    </Card>
                    <div>
                        <Button
                            type="primary"
                            onClick={() => {
                                copy(message);
                            }}
                        >{intl.formatMessage(messages.copy)}</Button>
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default Translate