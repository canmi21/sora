/* src/components/shared/system-status.tsx */

import React from "react";

interface SystemStatusProps {
	fontSize?: string;
	color?: string;
	className?: string;
}

export function SystemStatus({
	fontSize,
	color,
	className,
}: SystemStatusProps) {
	const style = {
		fontSize: fontSize,
		color: color,
	};

	return (
		<p style={style} className={className}>
			All systems normal.
		</p>
	);
}
