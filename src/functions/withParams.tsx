import React from "react";
import { useParams, Params } from "react-router-dom";

// Props que estarão sempre presentes
export interface InjectedParamsProps {
    params: Params<string>;
}

// HOC sem conflitos de nomes
export function withParams<P extends InjectedParamsProps>(
    WrappedComponent: React.ComponentType<P>
) {
    // Aqui usamos ComponentWithParams como nome do wrapper
    const ComponentWithParams = (props: Omit<P, "params">) => {
        const params = useParams(); // hook válido dentro de função
        const finalProps = { ...(props as P), params };
        return <WrappedComponent {...finalProps} />;
    };

    return ComponentWithParams;
}
