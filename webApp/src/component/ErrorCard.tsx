import { Link } from "react-router-dom";
import { Result, Button } from "antd";

export default function ErrorCard() {
    return (
        <div id="error-page">
            <Result
                status="500"
                title="Oops!"
                subTitle="Sorry, an unexpected error has occurred."
                extra={[
                    <Link to="/" key={
                        "back"
                    }>
                        <Button type="primary" >
                            Go back to Dashboard
                        </Button>
                    </Link>,
                    // <Button key="refresh">Refresh</Button>,
                ]}
            />
        </div>
    );
}