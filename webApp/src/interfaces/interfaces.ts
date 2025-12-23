import { FormInstance, FormProps } from "antd";
import { Rule } from "antd/es/form";
import React, { CSSProperties } from "react";

export interface LoginCardProps {
  // submitLoginDetails: (loginDetails: object) => void;
}

export interface CreatePasswordCardProps {
  submitCreatePassword: (CreatePasswordCard: object) => void;
}

export interface ForgetPasswordCardProps {
  submitForgetPassword: (ForgetPassword: string) => void;
  loading: boolean;
}

export interface NavbarItem {
  name: string;
  id: number;
}

export type QueryResult<T, K extends string> = {
  [P in K]: T[];
} & {
  totalRows: number;
  totalPages: number;
};

export interface ApiResponse<T> {
  data: {
    result: string | object | T;
  };
  message: string;
  statusCode: number;
}

export interface AuthButtonVariation {
  login: string;
  forgetPassword: string;
  createPassword: string;
  authPage: string;
}

interface TableButtonVariation {
  Add: string;
  AddType2: string;
  Edit: string;
  Show: string;
  Remove: string;
  Return: string;
  "Add Another": string;
  Save: string;
  "Send For Approval": string;
  "Approve Version": string;
  "Reset Approvals": string;
  "New Version": string;
  "Up-Arrow": string;
  "Down-Arrow": string;
  Prev: string;
  Next: string;
  "Show Records": string;
  "Hide Records": string;
  Export: string;
  "Import Parameter Lists": string;
  Unapproved: string;
}

export interface ModalButtonVariation {
  Save: string;
  Yes: string;
  ok: string;
  Cancel: string;
}

export interface ButtonVariation {
  auth: AuthButtonVariation[];
  table: TableButtonVariation[];
  modal: ModalButtonVariation[];
  none: string[];
}

export interface ButtonProps {
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  text?: string;
  size?: "small" | "medium" | "large";
  backgroundColor?: string;
  variant?: ButtonVariation | string | undefined;
  loading?: boolean;
  style?: CSSProperties;
  disabled?: boolean;
  childern?: React.ReactNode;
  icon?: React.ReactNode;
}

export interface NavbarItem {
  name: string;
  id: number;
}

export interface PasswordScreenLayoutProps {
  rectangleStyle: React.CSSProperties;
  RenderCard: React.FC;
}

type SelectMode =
  | "multiple"
  | "tags"
  | "SECRET_COMBOBOX_MODE_DO_NOT_USE"
  | "combobox";

interface isInputProps {
  placeholder?: string;
  defaultValue?: string | number | null;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  style?: CSSProperties;
  options?: Array<{ value: string | number; label: string }>;
  defaultChecked?: boolean;
  loading?: boolean;
  mode?: SelectMode;
}

export interface FormField {
  label: string;
  name: string;
  isInput: string;
  data: Array<{ value: string | number; label: string }>;
  rules: Rule[];
  dependencies?: [string];
  isInputProps?: isInputProps;
  style?: CSSProperties;
  renderFieldName?: string;
  // shouldRender?: boolean;
}

export interface DashboardFormsProps {
  formData: FormField[];
  formStyle?: React.CSSProperties;
  onFinish: (values: FormProps) => void;
  form: FormInstance<FormProps>;
  onValuesChange: (changedValues: object, allValues: object) => void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RenderState?: any;
}

export interface UserMasterTablePagination {
  current: number;
  pageSize: number;
  position: string[];
  showQuickJumper: boolean;
  showSizeChanger: boolean;
  style: object;
}

export interface MenuItems {
  id: number;
  name: string;
  icon: string;
  url: string;
  children: MenuItems[];
}

export interface User {
  id: number;
  email: string;
  uuid?: string | null;
  userName: string;
  firstName?: string | null;
  lastName?: string | null;
  dob?: Date | null;
  address?: string | null;
  profileImage?: string | null;
  type: Role; // Assuming Role is an enum you have defined elsewhere
  authType?: string | null;
  // Assuming Reel, StayHistory, WishlistReel, WishlistStay, Comments, Stay, Subscription are defined elsewhere
  Reel: Reel[];
  StayHistory: StayHistory[];
  WishlistReel: WishlistReel[];
  WishlistStay: WishlistStay[];
  Comments: Comments[];
  Stay: Stay[];
  Subscription: Subscription[];
}

export interface UserData {
  email: string;
  id: number;
  name: string;
  type: Role;
}

enum Role {
  superAdmin,
  hotelAdmin,
  customer,
}

interface Reel {
  id: number;
  userId: number;
  url: string;
  datetime: Date;
  location: string;
  deletedFlag: boolean;
  user: User; // Assuming User is defined elsewhere
  WishlistReel: WishlistReel[]; // Assuming WishlistReel is defined elsewhere
}

interface StayHistory {
  stayId: number;
  userId: number;
  date: Date;
  stay: Stay; // Assuming Stay is defined elsewhere
  user: User; // Assuming User is defined elsewhere
}
interface WishlistReel {
  userId: number;
  reelId: number;
  user: User; // Assuming User is defined elsewhere
  reel: Reel; // Assuming Reel is defined elsewhere
}

interface WishlistStay {
  userId: number;
  stayId: number;
  stay: Stay; // Assuming Stay is defined elsewhere
  user: User; // Assuming User is defined elsewhere
}

interface Comments {
  id: number;
  userId: number;
  stayId: number;
  comment: string;
  datetime: Date;
  user: User; // Assuming User is defined elsewhere
  stay: Stay; // Assuming Stay is defined elsewhere
}

export interface Stay {
  id?: number;
  name: string;
  address?: string;
  rating?: number;
  description: string;
  videos: string[];
  images: string[];
  adminId: number;
  contact: string;
  price: number;
  email: string;
  // Assuming StayHistory, WishlistStay, SpecialFacility, City, State, Country, and User are defined elsewhere
  StayHistory?: StayHistory[];
  WishlistStay?: WishlistStay[];
  specialFacilities?: SpecialFacility[];
  city?: City;
  cityId: number;
  state?: State;
  stateId: number;
  country?: Country;
  countryId: number;
  Users?: User[] | { user: User };
  userId: number;
  deletedFlag?: boolean;
}

interface Subscription {
  id: number;
  userId: number;
  planId: number;
  startDate: Date;
  expirationDate: Date;
  plan: Plan; // Assuming Plan is defined elsewhere
  user: User; // Assuming User is defined elsewhere
}

interface SpecialFacility {
  id: number;
  name: string;
}

export interface City {
  id?: number;
  name: string;
  imageUrl: string[];
  deletedFlag?: boolean;
  stateId: number;
  countryId: number;
}

export interface State {
  id?: number;
  name: string;
  imageUrl: string[];
  deletedFlag?: boolean;
  stateId: number;
  countryId: number;
}

export interface Country {
  id?: number;
  name: string;
  imageUrl: string[];
  deletedFlag?: boolean;
}

interface Plan {
  id: number;
  name: string;
  imageUrl: string;
  deletedFlag: boolean;
  stateId: number;
}

export interface FileType {
  uid: string;
}

export interface Amenity {
  id?: number;
  name: string;
  description: string;
  status?: string;
  userId?: string;
}
