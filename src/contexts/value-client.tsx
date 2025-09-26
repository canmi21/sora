/* src/contexts/value-client.tsx */

"use client";

import { createContext, useContext, ReactNode } from "react";
import type { GetValueResponse } from "~/api/value";

/**
 * Defines the shape of the context data.
 * We use a Map for efficient key lookups, storing only the final `value`.
 */
export type ValueContextType = Map<string, GetValueResponse["value"]>;

/**
 * The actual React Context. It will be provided by the server component wrapper.
 */
const ValueContext = createContext<ValueContextType | undefined>(undefined);

/**
 * The Client Provider component that receives server-fetched data via props
 * and makes it available to child components through context.
 */
export function ValueClientProvider({
	children,
	value,
}: {
	children: ReactNode;
	value: ValueContextType;
}) {
	return (
		<ValueContext.Provider value={value}>{children}</ValueContext.Provider>
	);
}

/**
 * Custom hook for easy access to the value context in Client Components.
 * This is the primary way client components will consume the data.
 */
export function useValueContext() {
	const context = useContext(ValueContext);
	if (context === undefined) {
		// This error helps catch cases where a component tries to use the context
		// outside of a rendered provider.
		throw new Error("useValueContext must be used within a ValueProvider");
	}
	return context;
}
