import create from 'zustand';
import supabase from '../supabase';
import { User } from "@supabase/supabase-js";
import env from '../../configs/vars';
import axios from "axios";

const API = axios.create({ baseURL: env.reactAppHost });
var userJson :string = '';
if (typeof window !== 'undefined') {
     userJson = localStorage.getItem('sb-wnpukijoybwfgrpearge-auth-token');
  }
const user = userJson ? JSON.parse(userJson) : null;
const tokenProfile = user ? user.access_token : null;

API.interceptors.request.use((req) => {
    req.headers.Authorization = `Bearer ${tokenProfile}`;
    return req;
});
;

interface Interface {
    getSchedule: (id: any) => void;
    getAppointment: () => void;
    getDoctors: () => void;
    getDoctor: () => void;
    signUpApp: (formData: any, isDoctor: string) => void;
    signInApp: (formData: any) => void;
    signOutApp: () => void;
    createBooking: (formData: any, isDoctor: string) => void;
    createSchedule: (formData: any) => void;
    rateBooking: (formData: any, idBooking: string) => void;
    delBooking: (id: any) => void;
    delSchedule: (id: any) => void;
    signIn: () => void;
    doctors: string | null;
    doctor: string | null;
    appointment: string | null;
    schedule: string | null;
    user: string | null;
}


export const useZustandStore = create<Interface>((set, get) => ({
    doctors: null,
    doctor: null,
    schedule: null,
    appointment: null,
    user: null,
    signUpApp: async (formData, isDoctor) => {
        try {
            const { data } = await API.post(`/user/register${isDoctor ? '/doctor' : ''}`, formData)
            return data
        } catch (error: any) {
            return error
        }
    },
    signInApp: async (formData) => {
        try {
            const { data } = await API.post(`/user/login`, formData)
            localStorage.setItem('sb-wnpukijoybwfgrpearge-auth-token', JSON.stringify(data.data.session));
            set(() => ({
                user: data.data.session,
            }));
            return data.data.session
        } catch (error: any) {
            return error
        }
    },
    signOutApp: async () => {
        await localStorage.clear();
    },
    getAppointment: async () => {
        try {
            const { data }: any = await API.get(`/booking`)
            set(() => ({
                appointment: data.data,
            }));
            return data
        } catch (error) {
            return error
        }
    },
    getDoctors: async () => {
        try {
            const { data: { data } }: any = await API.get(`/doctor`)
            set(() => ({
                doctors: data,
            }));
            return data
        } catch (error) {
            return error
        }
    },
    getDoctor: async () => {
        try {
            const { data: { data } }: any = await API.get(`/doctor/detail`)
            set(() => ({
                doctor: data,
            }));
            return data
        } catch (error) {
            return error
        }
    },
    getSchedule: async (id) => {
        try {
            const { data }: any = await API.get(`/doctor/${id}/schedule`)
                set(() => ({
                    schedule: data,
                }));
            return data
        } catch (error) {
            return error
        }
    },
    createBooking: async (formData, isDoctor) => {
        try {
            await API.post(`/booking/${isDoctor}`, formData)
        } catch (error) {
            return error
        }
    },
    createSchedule: async (formData) => {
        try {
            await API.post(`/doctor/schedule`, formData)
        } catch (error) {
            return error
        }
    },
    rateBooking: async (formData, idBooking) => {
        try {
            await API.put(`/booking/${idBooking}`, formData)
        } catch (error) {
            return error
        }
    },
    delBooking: async (id) => {
        try {
            await API.delete(`/booking/${id}`)
        } catch (error) {
            return error
        }
    },
    delSchedule: async (id) => {
        try {
            await API.delete(`/doctor/schedule/${id}`)
        } catch (error) {
            return error
        }
    },
    signIn: () => {
        supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: env.discordRedirect,
            }
        });
    }

})
);
