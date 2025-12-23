import { create } from "zustand";
import {
  MenuItems,
  User,
  UserData,
  UserMasterTablePagination,
} from "../interfaces/interfaces";

export const useStateZohoButton = create((set) => ({
  isZohoButtonUserMaster: false,
  setZohoButtonUserMaster: (value: boolean) =>
    set(() => ({
      isZohoButtonUserMaster: value,
    })),
}));

export const useStateUserMaster = create((set) => ({
  UserMasterTablePagination: {
    current: 1,
    pageSize: 10,
    // position: ['bottomCenter'],
    showQuickJumper: true,
    showSizeChanger: true,
    style: { float: "right" },
  },
  setUserMasterTablePagination: (value: UserMasterTablePagination) =>
    set(() => ({
      UserMasterTablePagination: value,
    })),
}));

export const useStateMenuList = create((set) => ({
  MenuList: [],
  setMenuList: (value: MenuItems) =>
    set(() => ({
      MenuList: value,
    })),
}));

export const useCurrentProfile = create((set) => ({
  currentProfile: localStorage.getItem("currentProfile") ?? "SYSADMIN",
  setCurrentProfile: (value: string) =>
    set(() => ({
      currentProfile: value,
    })),
}));

export const useUserRole = create((set) => ({
  UserRole: "",
  setUserRole: (value: string) =>
    set(() => ({
      UserRole: value,
    })),
}));

export const useCurrentUserData = create((set) => {
  const zohoTokenData = JSON.parse(
    localStorage.getItem("TripxingToken-Zoho") ?? "{}"
  );
  return {
    UserID: localStorage.getItem("VlimsUserID") ?? null,
    CurrentUserData: localStorage.getItem("CurrentUserData") ?? ({} as User),
    isZohoLogin: zohoTokenData.data?.loggedInUserId ? true : false,
    setCurrentUserData: (value: UserData) =>
      set(() => ({
        CurrentUserData: value,
      })),
    setUserID: (value: number) =>
      set(() => ({
        UserID: value,
      })),
    setIsZohoLogin: (value: boolean) =>
      set(() => ({
        isZohoLogin: value,
      })),
  };
});

interface paginationData {
  current: number;
  pageSize: number;
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  pageSizeOptions: string[];
  showTotal: (total: number, range: [number, number]) => string;
  total: number;
}
export const useDynamicTableStore = create((set) => ({
  tableData: {} as Record<string, paginationData[]>,
  setTableData: (page: string, data: paginationData) =>
    set(() => ({
      tableData: {
        [page]: data,
      },
    })),
}));
