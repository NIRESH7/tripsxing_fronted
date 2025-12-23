import { useMutation, useQuery } from "@tanstack/react-query";
import { MenuProps } from "antd/es/menu/menu";
import {
  GetApiCustomerRoutes,
  PostApiCustomerRoutes,
  PutApiCustomerRoutes
} from "./ApiCustomerHooks";
import { route } from "../routes/routes";


export const listControlItems: MenuProps["items"] = [
  {
    label: "View",
    key: "1",
    // icon: <UserOutlined />,
  },
  {
    label: "Delete",
    key: "2",
    // icon: <UserOutlined />,
  },
  {
    label: "Copy",
    key: "3",
    // icon: <UserOutlined />,
    // danger: true,
  },
  // {
  //     label: '4rd menu item',
  //     key: '4',
  //     icon: <UserOutlined />,
  //     danger: true,
  //     disabled: true,
  // },
];

export const securityItems: MenuProps["items"] = [
  //    Diasble
  //    Enable
  //    Force to Change Password
  //    Manage Department
  //    Manage Roles
  //    Manage Job types
  {
    label: "Disable",
    key: "1",
    // icon: <UserOutlined />,
  },
  {
    label: "Enable",
    key: "2",
    // icon: <UserOutlined />,
  },
  {
    label: "Force to Change Password",
    key: "3",
    // icon: <UserOutlined />,
  },
  {
    label: "Manage Department",
    key: "4",
    // icon: <UserOutlined />,
  },
  {
    label: "Manage Roles",
    key: "5",
    // icon: <UserOutlined />,
  },
  {
    label: "Manage Job types",
    key: "6",
    // icon: <UserOutlined />,
  },
];

export const manageUserModulesItems: MenuProps["items"] = [
  {
    label: "Manage User Modules",
    key: "1",
    // icon: <UserOutlined />,
  },
];

export const otherTaskItems: MenuProps['items'] = [
  // View Audit
  // View Pdf
  // View in Excel
  // Choose Report
  // Print view
  {
    label: 'View Audit',
    key: '1',
    // icon: <UserOutlined />,
  },
  {
    label: 'View Pdf',
    key: '2',
    // icon: <UserOutlined />,
  },
  {
    label: 'View in Excel',
    key: '3',
    // icon: <UserOutlined />,
  },
  {
    label: 'Choose Report',
    key: '4',
    // icon: <UserOutlined />,
  },
  {
    label: 'Print view',
    key: '5',
    // icon: <UserOutlined />,
  }
]

// Update the existing hooks with proper types
export const GetStay = <T>(stayId?: number) => {
  return useQuery<T>({
    queryKey: stayId ? ['Stay', stayId] : ['Stays'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(
        stayId ? `${route.backend.getStays}/${stayId}` : route.backend.getStays,
        localStorage.getItem("TripxingToken") ?? ''
      );
      return res.data;
    },
  });
};

export const GetCountry = <T>(countryId?: number) => {
  return useQuery<T>({
    queryKey: countryId ? ['Country', countryId] : ['Countries'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(
        countryId ? `${route.backend.getCountry}/${countryId}` : route.backend.getCountries,
        localStorage.getItem("TripxingToken") ?? ''
      );
      return res.data;
    },
  });
};

export const GetState = <T>(stateId?: number) => {
  return useQuery<T>({
    queryKey: stateId ? ['State', stateId] : ['States'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(stateId ? `${route.backend.getState}/${stateId}` : route.backend.getStates, localStorage.getItem("TripxingToken") ?? '');
      console.log('State', res.data);

      return res.data; // Assuming res.data contains the state data
    },
    // enabled: !!stateId
  });
}

export const GetCity = <T>(cityId?: number) => {
  return useQuery<T>({
    queryKey: cityId ? ['City', cityId] : ['Cities'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(cityId ? `${route.backend.getCity}/${cityId}` : route.backend.getCities, localStorage.getItem("TripxingToken") ?? '');
      console.log('City', res.data);

      return res.data; // Assuming res.data contains the city data
    },
    // enabled: !!cityId
  });
}

export const Getblog = <T>(blogId?: number) => {
  return useQuery<T>({
    queryKey: blogId ? ['Blog', blogId] : ['Blogs'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(blogId ? `${route.backend.getBlog}/${blogId}` : route.backend.getBlogs, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the blog data
    },
    // enabled: !!blogId
  });
};

export interface AuditLog {
  id: number;
  action: string;
  userId: number;
  model: string;
  changedItemId: number;
  timestamp: Date;
  oldValue: string | null;
  newValue: string | null;
  description: string | null;
}

export const GetAuditLogs = <T>() => {
  return useQuery<T>({
    queryKey: ['AuditLogs'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(route.backend.getAuditLogs, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the audit log data
    },
  });
}

export const GetAmenity = <T>(amenityId?: number) => {
  return useQuery<T>({
    queryKey: amenityId ? ['Amenity', amenityId] : ['Amenity'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(amenityId ? `${route.backend.getAmenity}/${amenityId}` : route.backend.getAmenities, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the amenity data
    },
    // enabled: !!amenityId
  });
}

export const GetPlan = <T>(planId?: number) => {
  return useQuery<T>({
    queryKey: planId ? ['Plan', planId] : ['Plans'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(planId ? `${route.backend.getPlan}/${planId}` : route.backend.getPlans, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the plan data
    },
    // enabled: !!planId
  });
}

export const GetUsers = <T>(userId?: number, type?: string) => {
  return useQuery<T>({
    queryKey: userId ? ['User', userId] : ['Users'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(userId ? `${route.backend.getUser}/${userId}` : `${type ? `${route.backend.getUsers}?type=${type}` : route.backend.getUsers}`, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the user data
    },
    // enabled: !!userId
  });
}


export const GetReel = <T>(reelId?: number) => {
  return useQuery<T>({
    queryKey: reelId ? ['Reel', reelId] : ['Reels'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(reelId ? `${route.backend.getReel}/${reelId}` : route.backend.getReels, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the plan data
    },
    // enabled: !!planId
  });
}


export const GetCoupoun = <T>(coupounId?: number) => {
  return useQuery<T>({
    queryKey: coupounId ? ['coupoun', coupounId] : ['coupouns'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(coupounId ? `${route.backend.getCoupoun}/${coupounId}` : route.backend.getCoupouns, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the plan data
    },
    // enabled: !!planId
  });
}

export const GetSubscriptionCount = <T>() => {
  return useQuery<T>({
    queryKey: ['SubscriptionCount'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(route.backend.getSubscriptionCount, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the subscription count
    },
  });
}

export const GetLandingPageMedia = <T>() => {
  return useQuery<T>({
    queryKey: ['medias'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(`${route.backend.getLandingPageAdMedias}`, localStorage.getItem("TripxingToken") ?? '');
      return res.data; // Assuming res.data contains the plan data
    },
    // enabled: !!planId
  });
}

interface MediaItem {
  id: number;
  url: string;
  type: 'image' | 'video';
  sequenceId: number;
}

export const LandingPageMediaHelper = () => {
  const getMedia = useQuery<MediaItem[]>({
    queryKey: ['medias'],
    queryFn: async () => {
      const res = await GetApiCustomerRoutes(route.backend.getLandingPageAdMedias, localStorage.getItem("TripxingToken") ?? '');
      return res.data;
    },
  });

  const createMedia = useMutation<MediaItem, Error, FormData | { url: string; type: string; userId: number }>({
    mutationFn: async (data) => {
      const res = await PostApiCustomerRoutes(route.backend.createLandingPageAdMedia, data, localStorage.getItem("TripxingToken") ?? '');
      return res.data;
    },
    onSuccess: () => {
      getMedia.refetch();
    }
  });

  const updateMedia = useMutation<any, Error, { ids: number[]; sequenceIds: number[], userId: number }>({
    mutationFn: async (data) => {
      const res = await PutApiCustomerRoutes(route.backend.reorderLandingPageAdMedia, data, localStorage.getItem("TripxingToken") ?? '');
      return res.data;
    },
    onSuccess: () => {
      getMedia.refetch();
    }
  });

  const DeleteMedia = useMutation<any, Error, { id: number, userId: number }>({
    mutationFn: async (data) => {
      const res = await PostApiCustomerRoutes(route.backend.deleteLandingPageAdMedia, data, localStorage.getItem("TripxingToken") ?? '');
      return res.data;
    },
    onSuccess: () => {
      getMedia.refetch();
    }
  });

  return {
    getMedia,
    createMedia,
    updateMedia,
    DeleteMedia
  }
}

// getUserStayHistory
interface StayHistoryParams {
  startDate?: string;
  endDate?: string;
  userId?: number;
  stayId?: number;
}

export const GetUserStayHistory = <T>(params?: StayHistoryParams) => {
  return useQuery<T>({
    queryKey: ['UserStayHistory', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.userId) queryParams.append('userId', params.userId.toString());
      if (params?.stayId) queryParams.append('stayId', params.stayId.toString());

      const url = `${route.backend.getUserStayHistory}?${queryParams.toString()}`;
      const res = await GetApiCustomerRoutes(url, localStorage.getItem("TripxingToken") ?? '');
      return res.data;
    },
  });
}

// GetUsersCouponHistory
// Define interface for coupon history filter parameters
interface CouponHistoryParams {
  userName?: string;
  email?: string;
  couponName?: string;
  startDate?: string;
  endDate?: string;
  isClaimed?: boolean;
  page?: number;
  userId?: string;
  pageSize?: number;
}

export const GetUsersCouponHistory = <T>(params?: CouponHistoryParams) => {
  return useQuery<T>({
    queryKey: ['UserCouponHistory', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      // if (params?.userName) queryParams.append('userName', params.userName);
      if (params?.email) queryParams.append('email', params.email);
      if (params?.couponName) queryParams.append('couponName', params.couponName);
      if (params?.userId) queryParams.append('userId', params.userId.toString());
      // if (params?.startDate) queryParams.append('startDate', params.startDate);
      // if (params?.endDate) queryParams.append('endDate', params.endDate);
      // if (params?.isClaimed !== undefined) queryParams.append('isClaimed', params.isClaimed.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const url = `${route.backend.getUserCouponHistory}?${queryParams.toString()}`;
      const res = await GetApiCustomerRoutes(url, localStorage.getItem("TripxingToken") ?? '');
      return res.data;
    }
  })
}