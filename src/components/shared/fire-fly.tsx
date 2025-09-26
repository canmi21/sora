/* src/components/shared/fire-fly.tsx */

"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface Dot {
	id: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
	opacity: number;
	scale: number;
	life: number;
	maxLife: number;
	animationDuration: number;
	animationDelay: number;
}

interface FireFlyProps {
	maxDots?: number;
	className?: string;
}

const FireFly: React.FC<FireFlyProps> = ({ maxDots = 25, className = "" }) => {
	const dotsContainerRef = useRef<HTMLDivElement>(null);
	const [dots, setDots] = useState<Dot[]>([]);
	const dotIdCounterRef = useRef(0);
	const animationFrameIdRef = useRef<number | null>(null);
	const containerWidthRef = useRef(0);
	const containerHeightRef = useRef(0);

	const createDot = useCallback((): Dot => {
		return {
			id: dotIdCounterRef.current++,
			x: Math.random() * containerWidthRef.current,
			y: Math.random() * containerHeightRef.current,
			vx: (Math.random() - 0.5) * 0.25,
			vy: (Math.random() - 0.5) * 0.5,
			opacity: Math.random() * 0.6 + 0.2,
			scale: Math.random() * 0.8 + 0.4,
			life: 0,
			maxLife: Math.random() * 8000 + 4000,
			animationDuration: Math.random() * 3 + 2,
			animationDelay: Math.random() * 2,
		};
	}, []);

	const initDots = useCallback(() => {
		if (!dotsContainerRef.current) return;

		const rect = dotsContainerRef.current.getBoundingClientRect();
		containerWidthRef.current = rect.width;
		containerHeightRef.current = rect.height;

		let currentDotCount = 0;
		const addDotsGradually = () => {
			if (currentDotCount < maxDots) {
				setDots((prev) => [...prev, createDot()]);
				currentDotCount++;
				setTimeout(addDotsGradually, Math.random() * 300 + 100); // 100-400ms
			}
		};

		addDotsGradually();
	}, [maxDots, createDot]);

	const updateDots = useCallback(() => {
		setDots((prevDots) => {
			const filteredDots = prevDots.filter((dot) => {
				dot.x += dot.vx;
				dot.y += dot.vy;
				dot.life += 16;

				const isOutOfBounds =
					dot.x < -10 ||
					dot.x > containerWidthRef.current + 10 ||
					dot.y < -10 ||
					dot.y > containerHeightRef.current + 10;

				const isLifeExpired = dot.life > dot.maxLife;

				return !isOutOfBounds && !isLifeExpired;
			});

			const updatedDots = [...filteredDots];

			// Add new dots randomly
			while (updatedDots.length < maxDots && Math.random() < 0.02) {
				updatedDots.push(createDot());
			}

			return updatedDots;
		});

		animationFrameIdRef.current = requestAnimationFrame(updateDots);
	}, [maxDots, createDot]);

	const handleResize = useCallback(() => {
		if (!dotsContainerRef.current) return;
		const rect = dotsContainerRef.current.getBoundingClientRect();
		containerWidthRef.current = rect.width;
		containerHeightRef.current = rect.height;
	}, []);

	useEffect(() => {
		initDots();
		updateDots();

		window.addEventListener("resize", handleResize);

		return () => {
			if (animationFrameIdRef.current) {
				cancelAnimationFrame(animationFrameIdRef.current);
			}
			window.removeEventListener("resize", handleResize);
		};
	}, [initDots, updateDots, handleResize]);

	return (
		<div
			ref={dotsContainerRef}
			className={`fixed inset-0 pointer-events-none z-0 ${className}`}
			style={{ width: "100%", height: "100%" }}
		>
			{dots.map((dot) => (
				<div
					key={dot.id}
					className="absolute w-0.5 h-0.5 bg-white/60 rounded-full animate-twinkle"
					style={{
						left: `${dot.x}px`,
						top: `${dot.y}px`,
						opacity: dot.opacity,
						transform: `scale(${dot.scale})`,
						animationDuration: `${dot.animationDuration}s`,
						animationDelay: `${dot.animationDelay}s`,
						willChange: "transform, opacity",
					}}
				/>
			))}
		</div>
	);
};

export default FireFly;
