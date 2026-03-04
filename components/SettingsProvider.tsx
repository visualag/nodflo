"use client";
import React, { createContext, useContext } from "react";

const SettingsContext = createContext<any>(null);

export function SettingsProvider({ settings, children }: { settings: any, children: React.ReactNode }) {
    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    return useContext(SettingsContext);
}
