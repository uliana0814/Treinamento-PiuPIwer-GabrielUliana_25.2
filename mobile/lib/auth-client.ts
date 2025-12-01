import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

const API_URL = "http://192.168.15.9:3000"; 

export const authClient = createAuthClient({
    baseURL: API_URL, 
    plugins: [
        expoClient({
            scheme: process.env.EXPO_PUBLIC_SCHEMA || "piupiwer", 
            storagePrefix: process.env.EXPO_PUBLIC_SCHEMA || "piupiwer",
            storage: SecureStore,
        })
    ]
});