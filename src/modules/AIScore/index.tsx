import React, {useContext, useState} from "react";
import Button from "@mui/material/Button";
import {SwipeableDrawer} from "@mui/material";
import Divider from "../../components/Divider";
import GlobalContext from "../../contexts/GlobalContext";
import {useNavigate} from "react-router";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    aiadvise: {
        id: 'btn.ai-advise',
    }
});
const AIScore = () => {
    const {scoreValues} = useContext(GlobalContext);
    const {score, advise} = scoreValues;
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const intl = useIntl();
    const toggleDrawer =
        (o: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setOpen(o);
            };
    return (
        <React.Fragment>
            <Button variant="outlined" onClick={toggleDrawer(true)}>{intl.formatMessage(messages.aiadvise)}</Button>
            <SwipeableDrawer
                anchor="right"
                open={open}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}

            >
                <div style={{
                    minWidth: 400,
                    padding: 10,
                }}>
                    <h5>Score：{score}</h5>
                    <Divider/>
                    <h5>
                        Advise：
                        {
                            score === 0 && (
                                <Button onClick={() => {
                                    navigate('/score')
                                }}>暂无建议，先去打分</Button>
                            )
                        }
                    </h5>

                    <div>
                        {advise?.map((e, index) =>
                            <div>
                                <span>{e}</span>
                            </div>
                        )}

                    </div>
                </div>
            </SwipeableDrawer>
        </React.Fragment>
    )

}

export default AIScore