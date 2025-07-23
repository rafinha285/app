import React from "react";
import { useParams } from "react-router-dom";

export function withParams<ParamsType extends Record<string, string>, P = {}>(
    WrappedComponent: React.ComponentType<P & { params: ParamsType }>
) {
    const ComponentWithParams: React.FC<P> = (props) => {
        const params = useParams<ParamsType>() as ParamsType;
        return <WrappedComponent {...props} params={params} />;
    };
    return ComponentWithParams;
}


// Gera um HOC que injeta os parâmetros de rota no componente
// export function withParams<ExpectedParams extends Record<string, string>, P = {}>(
//     WrappedComponent: React.ComponentType<P & { params: Partial<ExpectedParams> }>
// ): React.FC<P> {
//     return function ComponentWithParams(props: P) {
//         const params = useParams<ExpectedParams>();
//         return <WrappedComponent {...props} params={params} />;
//     };
// }