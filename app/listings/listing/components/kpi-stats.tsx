"use client";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

type KpiStatsProps = {
  stats: {
    description: string;
    value: number;
    subtext: string;
  }[];
};

export function KpiStats({ stats }: KpiStatsProps) {
  return (
    <section className="group/container relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl">
      <div className="relative z-20">
        <div className="align-center mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2">
          {stats.map((item, index) => (
            <motion.div
              initial={{
                y: 20,
                opacity: 0,
                filter: "blur(4px)",
              }}
              animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              key={"card" + index}
              className={cn("group/card relative overflow-hidden rounded-lg")}
            >
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-neutral-700 dark:text-neutral-200">
                  <AnimatedNumber value={item.value} />
                </p>
              </div>
              <p className="text-balance text-balance mt-4 text-base text-neutral-600 dark:text-neutral-300">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedNumber({
  value,
  initial = 0,
}: {
  value: number;
  initial?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref);

  const spring = useSpring(initial, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(),
  );

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    } else {
      spring.set(initial);
    }
  }, [isInView, spring, value, initial]);

  return <motion.span ref={ref}>{display}</motion.span>;
}
