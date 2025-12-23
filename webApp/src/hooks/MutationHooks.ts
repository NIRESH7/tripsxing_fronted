/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { route } from "../routes/routes";
import { DeleteApiCustomerRoutes, PostApiCustomerRoutes, PutApiCustomerRoutes } from "./ApiCustomerHooks";
// import { TripxingToken, TripxingTokenZoho } from "../utils/utils";
// import { useCurrentUserData } from "../utils/state";
import { message } from "antd";



export function SubmitLoginMutation() {
    const submitLoginDetails = async (LoginDetails: object) => {
        console.log(route);
        try {
            const res = await PostApiCustomerRoutes(route.backend.login, LoginDetails);
            return res;
        } catch (err) {
            console.log(err);
        }
    };
    return useMutation({
        mutationKey: ["submitLoginDetails"],
        mutationFn: (loginDetails: object) => submitLoginDetails(loginDetails),
        onMutate: (variables: object) => {
            console.log(variables);
        },
        onSuccess: (data) => {
            console.log(data.data);
            return data;
        },
    })
}


export function DeleteMutation({
    mutationKey,
    queryKeyToInvalidate,
    getSuccessMessage,
    getErrorMessage,
    onMutateCallback,
    onSettledCallback,
    routes
}: {
    mutationKey: any, // replace 'any' with the actual type
    queryKeyToInvalidate: any, // replace 'any' with the actual type
    getSuccessMessage: (variables: any) => string, // replace 'any' with the actual type of 'variables'
    getErrorMessage: any, // replace 'any' with the actual type
    onMutateCallback: any, // replace 'any' with the actual type
    onSettledCallback: any, // replace 'any' with the actual type
    routes: any // replace 'any' with the actual type
}) {
    const queryClient = useQueryClient();

    const deleteApiCall = async (data: any) => {
        try {
            const res = await DeleteApiCustomerRoutes(routes,data);
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    return useMutation({
        mutationKey,
        mutationFn: deleteApiCall,
        onMutate: onMutateCallback,
        onSettled: async (data, error, variables, context) => {
            console.log('data', data, 'error', error, 'variables', variables, 'context', context);

            if (data?.statusCode === 200) {
                message.success(getSuccessMessage(variables));
                await queryClient.invalidateQueries({
                    queryKey: queryKeyToInvalidate,
                    exact: false
                });
            } else if (error) {
                console.log(error);
                message.error(getErrorMessage(error));
                return error;
            }

            onSettledCallback(data, error, variables, context);
        },
        onError: (error) => {
            console.log(error);
            message.error(getErrorMessage(error));
            return error;
        }
    });
}


export function SaveMutation({
    mutationKey,
    queryKeyToInvalidate,
    // getSuccessMessage,
    // getErrorMessage,
    onMutateCallback,
    onSettledCallback,
    routes,
    isUpdate
}: {
    mutationKey: any, // replace 'any' with the actual type
    queryKeyToInvalidate: any, // replace 'any' with the actual type
    getSuccessMessage?: (variables: any) => string, // replace 'any' with the actual type of 'variables'
    getErrorMessage?: any, // replace 'any' with the actual type
    onMutateCallback: any, // replace 'any' with the actual type
    onSettledCallback: any, // replace 'any' with the actual type
    routes: any // replace 'any' with the actual type
    isUpdate?: boolean
}) {
    const queryClient = useQueryClient();

    const saveApiCall = async (data: any) => {
        try {
            if (isUpdate) {
                console.log('data', data);
                console.log('routes', routes);
                
                
                const res = await PutApiCustomerRoutes(routes, data);
                return res;
            } else {
                console.log('data', data);
                console.log('routes', routes);
                
                const res = await PostApiCustomerRoutes(routes, data);
                return res;
            }
        } catch (err) {
            console.log(err);
        }
    };

    return useMutation({
        mutationKey,
        mutationFn: saveApiCall,
        onMutate: onMutateCallback,
        onSettled: async (data, error, variables, context) => {
            console.log('data', data, 'error', error, 'variables', variables, 'context', context);

            if (data?.statusCode === 200) {
                // message.success(getSuccessMessage(variables));
                await queryClient.invalidateQueries({
                    queryKey: queryKeyToInvalidate,
                    exact: false
                });
            } else if (error) {
                // message.error(getErrorMessage(error));
            }

            onSettledCallback(data, error, variables, context);
        }
    });
}