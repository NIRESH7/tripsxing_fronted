import { ApiResponse } from '@/interfaces/interfaces';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
// import { route } from '../routes/routes';
// import { useNavigate } from 'react-router-dom';
export const GetApiCustomerRoutes = async (url: string, Authorization?: string) => {
    // console.log('GetApiCustomerRoutes', url);
    // const navigate = useNavigate();
    try {
        const response = await axios.get(url,
            Authorization ? { headers: { Authorization: `Bearer ${Authorization}` } } : {}
        );
        // console.log(response);
        if (response.status === 200) {
            return response.data;
        } else if (response.status === 401) {
            // return window.location.href = `${route.frontend.login}`
            // navigate('/login')
            return response
        }

    } catch (error) {
        console.error('Error:', error);
        // throw error
        // window.location.href = `${route.frontend.login}`;
        return error;
    }
}


export const PostApiCustomerRoutes = async <T>(url: string, data: T, AuthorizationToken?: string) => {
    // console.log('PostApiCustomerRoutes', url);
    console.log('PostApiCustomerRoutes', AuthorizationToken);
    const Authorization = localStorage.getItem("TripxingToken") ?? ''
    try {
        const response = await axios.post(
            url,
            data,
            Authorization ? { headers: { Authorization: `Bearer ${Authorization}` } } : {});
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error;
        // throw error;
    }
}


export const PutApiCustomerRoutes = async <T>(url: string, data: T, AuthorizationToken?: string) => {
    // console.log('PutApiCustomerRoutes', url);
    console.log('PutApiCustomerRoutes', AuthorizationToken);
    const Authorization = localStorage.getItem("TripxingToken") ?? ''
    try {
        const response = await axios.put(
            url,
            data,
            Authorization ? { headers: { Authorization: `Bearer ${Authorization}` } } : {});
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return error;
        // throw error;
    }

}

export const DeleteApiCustomerRoutes = async <T>(url: string, data: object): Promise<ApiResponse<T>> => {
    const AuthorizationToken = localStorage.getItem("TripxingToken") ?? ''

    try {
        const config = AuthorizationToken ? { headers: { Authorization: `Bearer ${AuthorizationToken}` }, data: data } : { data: data };
        const response = await axios.delete(url, config);
        return response.data;
    }
     catch (error) {
        console.error('Error:', error);
        return error as ApiResponse<T>;
    }
}


export const CustomUseQuery = <T>(QueryKey: T[], url: string, token: string) => {
    const { data, isLoading } = useQuery({
        queryKey: QueryKey,
        queryFn: () => GetApiCustomerRoutes(url, token).then((res) => {
            // console.log(res);
            return res.data;
        }),
    },
    )
    return { data, isLoading }
}