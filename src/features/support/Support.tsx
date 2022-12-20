import { Alert, Spinner, Title } from "@patternfly/react-core";
import { FunctionComponent } from "react";
import { useGetSupportInfoQuery } from "./supportApi";

export const Support: FunctionComponent = () => {
    const { data, isLoading, error } = useGetSupportInfoQuery();
    return (
        <div>
            <Title headingLevel="h1">Support</Title>
            {
                error ? (
                    <Alert variant="danger" title={JSON.stringify(error)} />
                ) : isLoading ? (
                    <Spinner />
                ) : data ? (
                    <div>
                        {Object.entries(data).map(([k, v]) => (
                            <div key={k} className="flex-split-2"><pre>{k}</pre><pre>{v}</pre></div>
                        ))}
                    </div>
                ) : null
            }
        </div>
    );
};