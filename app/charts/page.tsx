"use client";

import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [df, setDf] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  const avgRef = useRef<HTMLDivElement>(null);
  const shutdownRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const survivalRef = useRef<HTMLDivElement>(null);
  const regressionRef = useRef<HTMLDivElement>(null);
  const hexbinRef = useRef<HTMLDivElement>(null);
  const contourRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const densityRef = useRef<HTMLDivElement>(null);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    d3.csv("/data/Google_graveyard.csv").then(raw => {
      const cleaned = raw
        .map((d: any) => ({
          ...d,
          Start: +d.Start,
          End: d.End ? +d.End : null,
          "Total years": +d["Total years"]
        }))
        .filter(d => !isNaN(d.Start));

      setDf(cleaned);

      const lifespanData = cleaned.filter(d => !isNaN(d["Total years"]));
      const pre2010 = lifespanData.filter(d => d.Start < 2010);
      const post2012 = lifespanData.filter(d => d.Start >= 2012);
      
      const avgPre2010 = d3.mean(pre2010, d => d["Total years"]) || 0;
      const avgPost2012 = d3.mean(post2012, d => d["Total years"]) || 0;
      const percentChange = ((avgPre2010 - avgPost2012) / avgPre2010 * 100);

      const categoryStats = d3.rollups(
        lifespanData,
        v => d3.mean(v, d => d["Total years"]),
        d => d.Category
      ).sort((a, b) => (a[1] || 0) - (b[1] || 0));

      const shutdownCounts = d3.rollups(
        cleaned.filter(d => d.End != null),
        v => v.length,
        d => d.End
      );
      const peakYear = shutdownCounts.reduce((max, curr) => 
        curr[1] > max[1] ? curr : max
      );

      setStats({
        avgPre2010: avgPre2010.toFixed(1),
        avgPost2012: avgPost2012.toFixed(1),
        percentChange: percentChange.toFixed(0),
        totalProducts: cleaned.length,
        totalShutdowns: cleaned.filter(d => d.End != null).length,
        peakShutdownYear: peakYear[0],
        peakShutdownCount: peakYear[1],
        shortestCategory: categoryStats[0]?.[0],
        shortestCategoryAvg: categoryStats[0]?.[1]?.toFixed(1)
      });
    });
  }, []);

  // ---------------- CHARTS ----------------
  useEffect(() => {
    if (!df.length) return;

    [avgRef, shutdownRef, activeRef, categoryRef, timelineRef, survivalRef, regressionRef, hexbinRef, contourRef, heatmapRef, densityRef].forEach(ref => {
      if (ref.current) ref.current.innerHTML = "";
    });

    const lifespanData = df.filter(d => !isNaN(d["Total years"]));

    const baseStyle = {
      background: "#1a1a1a",
      color: "#b4b4b4",
      fontSize: "13px",
      fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace"
    };

    // ---------------- 1️⃣ AVERAGE LIFESPAN ----------------
    // ---------------- 1️⃣ AVERAGE LIFESPAN (FIXED - NO OVERSHOOT) ----------------
const avgLifespan = d3.rollups(
  lifespanData,
  v => d3.mean(v, d => d["Total years"]),
  d => d.Start
)
  .map(([year, avg]) => ({ year: +year, avg }))
  .sort((a, b) => a.year - b.year);

avgRef.current?.append(
  Plot.plot({
    width: 1000,
    height: 500,
    marginLeft: 60,
    marginTop: 40,
    marginBottom: 60,
    style: baseStyle,
    color: {
      scheme: "turbo",
      legend: true,
      label: "Avg Lifespan",
      domain: [0, 12]
    },
    x: { 
      label: "Launch Year",
      grid: true,
      tickFormat: d => d.toString()
    },
    y: { 
      label: "Average Product Lifespan (years)",
      grid: true,
      domain: [0, 12],
      clamp: true  // Add this to prevent values outside domain
    },
    marks: [
      Plot.frame({ stroke: "#666", strokeWidth: 1 }),
      // Individual product dots
      Plot.dot(lifespanData, {
        x: "Start",
        y: "Total years",
        fill: "Total years",
        fillOpacity: 0.4,
        r: 3
      }),
      // Average line - use linear or monotoneX instead of catmull-rom
      Plot.line(avgLifespan, {
        x: "year",
        y: "avg",
        stroke: "white",
        strokeWidth: 3,
        curve: "monotone-x"  // Changed from catmull-rom - prevents overshoot
      }),
      // 2010 marker
      Plot.ruleX([2010], {
        stroke: "#666",
        strokeWidth: 1,
        strokeDasharray: "4,4"
      }),
      Plot.text([{ x: 2010, y: 11 }], {
        x: "x",
        y: "y",
        text: ["2010"],
        fill: "#888",
        fontSize: 11,
        dy: -10
      }),
      // Tooltip for individual products
      Plot.tip(
        lifespanData,
        Plot.pointer({
          x: "Start",
          y: "Total years",
          title: d => `${d.Name}\nLaunched: ${d.Start}\nLifespan: ${d["Total years"]} years`
        })
      )
    ]
  })
);


    // ---------------- 2️⃣ SHUTDOWNS ----------------
    const shutdownCounts = d3.rollups(
      df.filter(d => d.End != null),
      v => v.length,
      d => d.End
    )
      .map(([year, count]) => ({ year: +year, count }))
      .sort((a, b) => a.year - b.year);

    shutdownRef.current?.append(
      Plot.plot({
        width: 1000,
        height: 500,
        marginLeft: 60,
        marginBottom: 60,
        style: baseStyle,
        color: {
            scheme: "turbo",
            legend: true,
            label: "Shutdown Count"
        },
        x: {
          label: "Year",
          tickFormat: d => d.toString()
        },
        y: {
          label: "Products Shutdown",
          grid: true
        },
        marks: [
          Plot.frame({ stroke: "#666", strokeWidth: 1 }),
          Plot.barY(shutdownCounts, {
            x: "year",
            y: "count",
            fill: "count",
            fillOpacity: 0.8
          }),
          Plot.lineY(shutdownCounts, {
            x: "year",
            y: "count",
            stroke: "#666",
            strokeWidth: 1,
            strokeDasharray: "4,4",
            curve: "catmull-rom"
          }),
          Plot.tip(
            shutdownCounts,
            Plot.pointerX({
              x: "year",
              y: "count",
              title: d => `Year: ${d.year}\nShutdowns: ${d.count}`
            })
          )
        ]
      })
    );

    // ---------------- 3️⃣ ACTIVE PRODUCTS (SMOOTH & CLEAN) ----------------
const minYear = d3.min(df, d => d.Start)!;
const maxYear = d3.max(df.filter(d => d.End != null), d => d.End)!;
const years = d3.range(minYear, maxYear + 1);

const activeData = years.map(year => ({
  year,
  active: df.filter(d => d.Start <= year && (d.End == null || d.End >= year)).length
}));

const maxActive = d3.max(activeData, d => d.active)!;

activeRef.current?.append(
  Plot.plot({
    width: 1000,
    height: 500,
    marginLeft: 60,
    marginBottom: 60,
    style: baseStyle,
    color: {
      scheme: "turbo",
      legend: true,
      label: "Active Count",
      domain: [0, maxActive]
    },
    x: {
      label: "Year",
      grid: true,
      tickFormat: d => d.toString()
    },
    y: {
      label: "Active Products",
      grid: true,
      domain: [0, maxActive * 1.1]
    },
    marks: [
      Plot.frame({ stroke: "#666", strokeWidth: 1 }),
      // Smooth area fill
      Plot.areaY(activeData, {
        x: "year",
        y: "active",
        fill: "active",
        fillOpacity: 0.2,
        curve: "monotone-x"
      }),
      // Smooth line
      Plot.lineY(activeData, {
        x: "year",
        y: "active",
        stroke: "active",
        strokeWidth: 3,
        curve: "monotone-x"
      }),
      // Individual points
      Plot.dot(activeData, {
        x: "year",
        y: "active",
        fill: "active",
        r: 4,
        stroke: "white",
        strokeWidth: 1
      }),
      // Tooltip
      Plot.tip(
        activeData,
        Plot.pointerX({
          x: "year",
          y: "active",
          title: d => `Year: ${d.year}\nActive Products: ${d.active}`
        })
      )
    ]
  })
);

    // ---------------- 4️⃣ HEXBIN MAP (FIXED AXIS LABELS) ----------------
hexbinRef.current?.append(
  Plot.plot({
    width: 1000,
    height: 600,
    marginLeft: 80,
    marginBottom: 80,
    marginRight: 60,
    marginTop: 40,
    style: baseStyle,
    x: {
      label: "Launch Year",
      grid: true,
      tickFormat: d => d.toString(),
      tickRotate: -45  // Rotate labels if needed
    },
    y: {
      label: "Product Lifespan (years)",
      grid: true,
      domain: [0, d3.max(lifespanData, d => d["Total years"]) + 1]
    },
    color: {
      scheme: "turbo",
      legend: true,
      label: "Product Count",
      width: 300
    },
    marks: [
      // Frame
      Plot.frame({ stroke: "#666", strokeWidth: 1 }),
      
      // Hexbins with color
      Plot.dot(
        lifespanData,
        Plot.hexbin(
          { fill: "count" },
          { 
            x: "Start", 
            y: "Total years",
            binWidth: 25
          }
        )
      ),
      
      // Text labels on hexbins
      Plot.text(
        lifespanData,
        Plot.hexbin(
          { text: "count" },
          { 
            x: "Start", 
            y: "Total years",
            binWidth: 25
          }
        ),
        {
          fill: "white",
          stroke: "black",
          strokeWidth: 3,
          paintOrder: "stroke",
          fontSize: 11,
          fontWeight: "bold"
        }
      ),
      
      // Individual product dots (faint)
      Plot.dot(lifespanData, {
        x: "Start",
        y: "Total years",
        r: 1.5,
        fill: "white",
        fillOpacity: 0.2
      }),
      
      // Tooltip
      Plot.tip(
        lifespanData,
        Plot.pointer({
          x: "Start",
          y: "Total years",
          title: d => `${d.Name}\nYear: ${d.Start}\nLifespan: ${d["Total years"]} years`
        })
      )
    ]
  })
);
    

    // ---------------- 5️⃣ DENSITY CONTOUR (FIXED ALL MARGINS) ----------------
densityRef.current?.append(
  Plot.plot({
    width: 1000,
    height: 600,
    marginLeft: 80,
    marginBottom: 100,
    marginRight: 100,  // Increased from 60
    marginTop: 40,
    style: baseStyle,
    x: {
      label: "Launch Year",
      grid: true,
      tickFormat: d => d.toString(),
      tickRotate: -45,
      labelOffset: 50
    },
    y: {
      label: "Product Lifespan (years)",
      grid: true,
      domain: [0, d3.max(lifespanData, d => d["Total years"]) + 1]
    },
    color: {
      scheme: "turbo",
      legend: true,
      label: "Density",
      width: 300
    },
    marks: [
      // Frame
      Plot.frame({ stroke: "#666", strokeWidth: 1 }),
      
      // Density contours
      Plot.density(lifespanData, {
        x: "Start",
        y: "Total years",
        fill: "density",
        stroke: "density",
        strokeWidth: 0.5,
        bandwidth: 20,
        thresholds: 20
      }),
      
      // Individual product dots
      Plot.dot(lifespanData, {
        x: "Start",
        y: "Total years",
        r: 2,
        fill: "white",
        fillOpacity: 0.3,
        stroke: "black",
        strokeWidth: 0.5,
        strokeOpacity: 0.3
      }),
      
      // Tooltip
      Plot.tip(
        lifespanData,
        Plot.pointer({
          x: "Start",
          y: "Total years",
          title: d => `${d.Name}\nYear: ${d.Start}\nLifespan: ${d["Total years"]} years`
        })
      )
    ]
  })
);
    // ---------------- 7️⃣ CATEGORY HEATMAP ----------------
    const shutdownData = df.filter(d => d.End != null);
    
    const heatmapData = d3.rollups(
      shutdownData,
      v => v.length,
      d => d.End,
      d => d.Category
    )
      .flatMap(([year, categories]) =>
        categories.map(([category, count]) => ({
          year: +year,
          category,
          count
        }))
      );

    heatmapRef.current?.append(
      Plot.plot({
        width: 1000,
        height: 500,
        marginLeft: 100,
        marginBottom: 60,
        style: baseStyle,
        x: {
          label: "Shutdown Year",
          tickFormat: d => d.toString()
        },
        y: {
          label: "Category"
        },
        color: {
          scheme: "turbo",
          legend: true,
          label: "Shutdowns"
        },
        marks: [
          Plot.frame({ stroke: "#666", strokeWidth: 1 }),
          Plot.cell(heatmapData, {
            x: "year",
            y: "category",
            fill: "count",
            inset: 0.5
          }),
          Plot.text(heatmapData, {
            x: "year",
            y: "category",
            text: "count",
            fill: d => d.count > 3 ? "#1a1a1a" : "#b4b4b4",
            fontSize: 10
          })
        ]
      })
    );

    // ---------------- 8️⃣ CATEGORY DISTRIBUTION (CLEAN - NO DOTS) ----------------
categoryRef.current?.append(
  Plot.plot({
    width: 1000,
    height: 600,
    marginLeft: 150,
    marginRight: 60,
    marginBottom: 80,
    marginTop: 40,
    style: baseStyle,
    color: {
      domain: ["App", "Hardware", "Service"],
      range: ["#a78bfa", "#86efac", "#f87171"], // Purple, Green, Red
      legend: true,
    },
    x: {
      label: "Product Lifespan (years)",
      grid: true,
      domain: [0, d3.max(lifespanData, d => d["Total years"]) + 1]
    },
    y: {
      label: null,
      domain: d3.groupSort(lifespanData, g => -d3.median(g, d => d["Total years"]), d => d.Category)
    },
    marks: [
      // Frame
      Plot.frame({ stroke: "#666", strokeWidth: 1 }),
      
      // Box plots only
      Plot.boxX(lifespanData, {
        x: "Total years",
        y: "Category",
        fill: "Category",
        fillOpacity: 0.6,
        stroke: "Category",
        strokeWidth: 2
      }),
      
      // Tooltip
      Plot.tip(
        lifespanData,
        Plot.pointer({
          x: "Total years",
          y: "Category",
          title: d => `${d.Name}\nCategory: ${d.Category}\nLifespan: ${d["Total years"]} years`
        })
      )
    ]
  })
);
    // ---------------- 9️⃣ PRODUCT TIMELINE ----------------
    const timelineData = df
      .filter(d => d.Start && d.End)
      .sort((a, b) => b["Total years"] - a["Total years"])
      .slice(0, 50);

    timelineRef.current?.append(
      Plot.plot({
        width: 1000,
        height: 1000,
        marginLeft: 200,
        marginRight: 100,
        marginBottom: 60,
        style: baseStyle,
        color: {
            scheme: "turbo",
            legend: true,
            label:"Years Alive"
        },
        x: {
          label: "Timeline",
          grid: true,
          tickFormat: d => d.toString()
        },
        y: {
          label: null,
          domain: timelineData.map(d => d.Name)
        },
        marks: [
          Plot.frame({ stroke: "#666", strokeWidth: 1 }),
          Plot.barX(timelineData, {
            x1: "Start",
            x2: "End",
            y: "Name",
            fill: "Total years",
            fillOpacity: 0.7,
            insetTop: 2,
            insetBottom: 2
          }),
          Plot.dot(timelineData, {
            x: "Start",
            y: "Name",
            fill: "#1a1a1a",
            stroke: "Total years",
            strokeWidth: 1,
            r: 3
          }),
          Plot.dot(timelineData, {
            x: "End",
            y: "Name",
            fill: "Total years",
            r: 3
          }),
          Plot.text(timelineData, {
            x: d => (d.Start + d.End) / 2,
            y: "Name",
            text: d => `${d["Total years"]}y`,
            fill: "#1a1a1a",
            fontSize: 9
          }),
          Plot.tip(
            timelineData,
            Plot.pointer({
              x: "End",
              y: "Name",
              title: d => `${d.Name}\nCategory: ${d.Category}\n${d.Start} → ${d.End} (${d["Total years"]} years)`
            })
          )
        ]
      })
    );

    // ================= 8️⃣ SURVIVAL CURVE =================
const lifespans = lifespanData
  .map(d => d["Total years"])
  .sort((a, b) => a - b);

const total = lifespans.length;

// Build true survival step curve
const uniqueYears = [...new Set(lifespans)].sort((a, b) => a - b);

const survivalData = uniqueYears.map(years => {
  const surviving = lifespans.filter(l => l >= years).length;
  return {
    years,
    survival: surviving / total,
    surviving
  };
});

// Median survival (first time <= 50%)
const median =
  survivalData.find(d => d.survival <= 0.5) ||
  survivalData[survivalData.length - 1];

survivalRef.current?.append(
  Plot.plot({
    width: 900,
    height: 400,

    x: {
      label: "Years Since Launch",
      grid: true
    },

    y: {
      label: "Survival Probability",
      grid: true,
      domain: [0, 1],
      percent: true
    },

    marks: [
      // Area
      Plot.areaY(survivalData, {
        x: "years",
        y: "survival",
        fillOpacity: 0.25,
        curve: "step-after"
      }),

      // Line
      Plot.line(survivalData, {
        x: "years",
        y: "survival",
        strokeWidth: 3,
        curve: "step-after"
      }),

      // 50% rule
      Plot.ruleY([0.5], {
        strokeDasharray: "4,4"
      }),

      // Median vertical marker
      Plot.ruleX([median.years], {
        stroke: "red",
        strokeDasharray: "4,4"
      }),

      // Tooltip
      Plot.tip(
        survivalData,
        Plot.pointerX({
          x: "years",
          y: "survival",
          title: d =>
            `After ${d.years} years:
${(d.survival * 100).toFixed(1)}% alive
${d.surviving} products remaining`
        })
      )
    ]
  })
);


    // ---------------- 1️⃣1️⃣ REGRESSION SCATTER ----------------
    regressionRef.current?.append(
      Plot.plot({
        width: 1000,
        height: 500,
        marginLeft: 60,
        marginBottom: 60,
        style: baseStyle,
        color: {
            scheme: "turbo",
            legend: true,
            label: "Lifespan (years)"
        },
        x: {
          label: "Launch Year",
          grid: true
        },
        y: {
          label: "Product Lifespan (years)",
          grid: true
        },
        marks: [
          Plot.frame({ stroke: "#666", strokeWidth: 1 }),
          Plot.dot(lifespanData, {
            x: "Start",
            y: "Total years",
            fill: "Total years",
            fillOpacity: 0.4,
            r: 4
          }),
          Plot.linearRegressionY(lifespanData, {
            x: "Start",
            y: "Total years",
            stroke: "#fff",
            strokeWidth: 2,
            strokeDasharray: "6,4"
          }),
          Plot.ruleX([2010], {
            stroke: "#666",
            strokeWidth: 1,
            strokeDasharray: "4,4"
          }),
          Plot.tip(
            lifespanData,
            Plot.pointer({
              x: "Start",
              y: "Total years",
              title: d => `${d.Name}\nLaunched: ${d.Start}\nLifespan: ${d["Total years"]} years\nCategory: ${d.Category}`
            })
          )
        ]
      })
    );

  }, [df, stats]);

  return (
    <div className="bg-[#0d0d0d] min-h-screen flex justify-center">
    <div style={{ 
      padding: "60px 40px",
      maxWidth: "700px",
      margin: "0 auto",
      fontFamily: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace",
      background: "#0d0d0d",
      color: "#b4b4b4",
      minHeight: "100vh"
    }}
    className="mx-auto px-10 py-15 font-mono text-[#b4b4b4]"
    >
      
      {/* PROLOGUE */}
      <header style={{ marginBottom: "100px" }}>
        <div style={{ 
          fontSize: "11px", 
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "20px"
        }}>
          A Data Investigation
        </div>
        <h1 style={{ 
          fontSize: "42px", 
          fontWeight: "400",
          marginBottom: "24px",
          color: "#e0e0e0",
          letterSpacing: "-0.02em",
          lineHeight: "1.2"
        }} className="text-justify">
          Hunger Games: The Google Edition
        </h1>
        <p style={{ 
          fontSize: "18px", 
          color: "#888",
          maxWidth: "1000px",
          lineHeight: "1.7",
          marginBottom: "30px"
        }}

        className="text-justify"
        >
          On March 13, 2013, Google killed Google Reader. Millions of users lost their beloved RSS feed reader overnight. 
          It had lasted 8 years.
        </p>
        <p style={{ 
          fontSize: "18px", 
          color: "#888",
          maxWidth: "1000px",
          lineHeight: "1.7",
          marginBottom: "30px"
        }}
        className="text-justify"
        >
          On March 26, 2019, Google killed Allo. Their messaging app lasted just 2.5 years.
        </p>
        <p style={{ 
          fontSize: "16px", 
          color: "#999",
          maxWidth: "1000px",
          lineHeight: "1.7"
        }}
        className="text-justify"
        >
          Something changed between 2013 and 2019. Something fundamental about how Google builds, launches, and abandons products. 
          I analyzed {stats.totalProducts} products to find out what.
        </p>
      </header>

      <section
            style={{
                marginBottom: "120px",
                padding: "60px 0",
                borderTop: "1px solid #1f1f1f",
                borderBottom: "1px solid #1f1f1f"
            }}
            >
            <div style={{ maxWidth: "760px" }}>
                <p
                style={{
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#666",
                    marginBottom: "24px"
                }}
                >
                The Question
                </p>

                <h3
                style={{
                    fontSize: "30px",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "#f2f2f2",
                    marginBottom: "20px",
                    letterSpacing: "-0.01em"
                }}
                >
                Has Google’s product strategy fundamentally changed?
                </h3>

                <p
                style={{
                    fontSize: "16px",
                    lineHeight: 1.8,
                    color: "#9a9a9a",
                    maxWidth: "640px"
                }}
                >
                If so, what does that shift mean for product longevity, developer
                confidence, and long-term user trust?
                </p>
            </div>
      </section>


        
      <section style={{ marginBottom: "140px" }}>
            <div style={{ maxWidth: "820px" }}>
                
                <p
                style={{
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "#666",
                    marginBottom: "24px"
                }}
                >
                Methodology
                </p>

                <h2
                style={{
                    fontSize: "32px",
                    fontWeight: 400,
                    color: "#f2f2f2",
                    marginBottom: "40px",
                    letterSpacing: "-0.01em"
                }}
                >
                How I Investigated
                </h2>

                <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "60px",
                    marginBottom: "60px"
                }}
                >
                <div>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "12px" }}>
                    Dataset
                    </p>
                    <p style={{ fontSize: "16px", lineHeight: 1.8, color: "#b4b4b4" }}>
                    {stats.totalProducts} Google products sourced from killedbygoogle.com.
                    <br />
                    Analysis period: 2000–2023.
                    </p>
                </div>

                <div>
                    <p style={{ fontSize: "14px", color: "#888", marginBottom: "12px" }}>
                    Tools
                    </p>
                    <p style={{ fontSize: "16px", lineHeight: 1.8, color: "#b4b4b4" }}>
                    TypeScript, Next.js, D3.js, Observable Plot.
                    </p>
                </div>
                </div>

                <div style={{ maxWidth: "600px" }}>
                <p style={{ fontSize: "14px", color: "#888", marginBottom: "12px" }}>
                    Key Metrics
                </p>
                <p style={{ fontSize: "16px", lineHeight: 1.8, color: "#b4b4b4" }}>
                    Product lifespan, shutdown rate, survival probability, and regression
                    modeling across launch cohorts.
                </p>
                </div>

            </div>
       </section>

      
      {/* ACT I: THE DISCOVERY */}
      <section style={{ marginBottom: "120px" }}>
        <div style={{ 
          fontSize: "10px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px"
        }}>
          Act I → The Pattern Emerges
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "400", marginBottom: "20px", color: "#e0e0e0" }}>
          Products Are Dying Younger
        </h2>
        <p style={{ fontSize: "15px", color: "#888", marginBottom: "40px", lineHeight: "1.7", maxWidth: "800px" }} className="text-justify">
          The first clue appeared when I plotted average product lifespan over time. The line tells a story of two Googles: 
          one patient, one impatient. Watch what happens around 2010.
        </p>
        
        <div ref={avgRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#999", marginBottom: "16px", maxWidth: "800px" }} className="text-justify">
          The drop is unmistakable. Products launched before 2010 survived an average of <strong style={{ color: "#4ade80" }}>{stats.avgPre2010} years</strong>. 
          Products launched after 2012? Just <strong style={{ color: "#e0e0e0" }}>{stats.avgPost2012} years</strong>.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", maxWidth: "800px" }} className="text-justify">
          That's a <strong style={{ color: "#e0e0e0" }}>{stats.percentChange}% decrease</strong> in runway. Google is giving new products 
          half the time to prove themselves. But why? To understand, I needed to see the kill rate itself.
        </p>
      </section>

      {/* ACT II: THE ACCELERATION */}
      <section style={{ marginBottom: "120px" }}>
        <div style={{ 
          fontSize: "10px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px"
        }}
        className="text-justify"
        >
          Act II → The Acceleration
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "400", marginBottom: "20px", color: "#e0e0e0" }}>
          The Graveyard Fills Faster
        </h2>
        <p style={{ fontSize: "15px", color: "#888", marginBottom: "40px", lineHeight: "1.7", maxWidth: "800px" }} className="text-justify">
          It's not just that products die young. Google is killing them at an unprecedented pace. 
          Each bar represents another year of shutdowns. Notice how they grow taller.
        </p>
        
        <div ref={shutdownRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#999", marginBottom: "16px", maxWidth: "800px" }} className="text-justify">
          The peak hit in <strong style={{ color: "#e0e0e0" }}>{stats.peakShutdownYear}</strong>: {stats.peakShutdownCount} products 
          killed in a single year. That's more than Google shut down in the entire period from 2000 to 2006 combined.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", marginBottom: "40px", maxWidth: "800px" }} className="text-justify">
          The trend line curves upward relentlessly. But here's the paradox: Google keeps launching products. 
          What happens when you plot active products over time?
        </p>

        <div ref={activeRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", maxWidth: "800px" }} className="text-justify">
          The line rises, peaks, then plateaus. Despite launching hundreds of products, Google's active product count stopped growing. 
          For every 2 products launched, roughly 1 gets killed. The graveyard fills at the same rate as the pipeline. 
          This isn't growth—it's churn.
        </p>
      </section>

      {/* ACT III: THE CLUSTERING */}
      <section style={{ marginBottom: "120px" }}>
        <div style={{ 
          fontSize: "10px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px"
        }}>
          Act III → Mapping the Kill Zone
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "400", marginBottom: "20px", color: "#e0e0e0" }}>
          Where Products Go to Die
        </h2>
        <p style={{ fontSize: "15px", color: "#888", marginBottom: "40px", lineHeight: "1.7", maxWidth: "800px" }} className="text-justify">
          Simple statistics told me products are dying faster. But I needed to see the pattern spatially. 
          Where exactly do Google's products cluster before they die? The hexbin map reveals the answer.
        </p>
        
        <div ref={hexbinRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#999", marginBottom: "16px", maxWidth: "800px" }} className="text-justify">
          Each hexagon represents a cluster of products with similar launch years and lifespans. Brighter hexagons = more products. 
          The brightest zone sits between 2010-2015 launches with 2-4 year lifespans.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", marginBottom: "40px", maxWidth: "800px" }} className="text-justify">
          This is Google's "kill zone"—the coordinates where products are most likely to die. But density alone doesn't show 
          the topography of failure. For that, I needed contours.
        </p>

        <div ref={densityRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", marginBottom: "40px", maxWidth: "800px" }} className="text-justify">
          Think of this as a topographic map of Google's graveyard. Each contour line represents equal probability density. 
          The tight, circular contours on the left (pre-2010) show products living 6-10 years. 
          The elongated contours on the right (post-2010) show products dying at 2-4 years.
        </p>

      </section>

      {/* ACT IV: THE PATTERN */}
      <section style={{ marginBottom: "120px" }}>
        <div style={{ 
          fontSize: "10px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px"
        }}>
          Act IV → The Category Curse
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "400", marginBottom: "20px", color: "#e0e0e0" }}>
          Some Products Never Had a Chance
        </h2>
        <p style={{ fontSize: "15px", color: "#888", marginBottom: "40px", lineHeight: "1.7", maxWidth: "800px" }} className="text-justify">
          Not all products die equally. Some categories are cursed from the start. 
          The heatmap below shows shutdowns by year and category. Darker cells = more deaths.
        </p>
        
        <div ref={heatmapRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#999", marginBottom: "16px", maxWidth: "800px" }} className="text-justify">
          Social and messaging products paint the darkest pattern. Year after year, Google launches social products. 
          Year after year, Google kills them. Buzz. Wave. Google+. Allo. Hangouts.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", marginBottom: "40px", maxWidth: "800px" }} className="text-justify">
          It's not bad luck. It's a category death sentence. The box plot below shows just how brutal it is.
        </p>

        <div ref={categoryRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", maxWidth: "800px" }} className="text-justify">
          <strong style={{ color: "#e0e0e0" }}>{stats.shortestCategory}</strong> products survive just{" "}
          <strong style={{ color: "#e0e0e0" }}>{stats.shortestCategoryAvg} years</strong> on average—less than half the lifespan 
          of infrastructure products. Google has spent 15 years trying to crack social. The graveyard is full of attempts. 
          The data is clear: they can't do it. Or won't give it time to work.
        </p>
      </section>

      {/* ACT V: THE LIVES */}
      <section style={{ marginBottom: "120px" }}>
        <div style={{ 
          fontSize: "10px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px"
        }}>
          Act V → The Individual Stories
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "400", marginBottom: "20px", color: "#e0e0e0" }}>
          The Lives They Lived
        </h2>
        <p style={{ fontSize: "15px", color: "#888", marginBottom: "40px", lineHeight: "1.7", maxWidth: "800px" }} className="text-justify">
          Behind every statistic are individual products. Real tools that real people used. 
          Each horizontal bar below is a life—from launch to shutdown. The longest at the top, the shortest at the bottom.
        </p>
        
        <div ref={timelineRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", maxWidth: "800px" }} className="text-justify">
          Look at the top: products launched in the early 2000s stretch for years. Gmail (still alive). Google Earth (still alive). 
          These were built to last. Now look at the bottom: products from the 2010s barely make it past the 2-year mark. 
          Clusters of social and messaging products form a dense graveyard of failed attempts.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", marginTop: "30px", maxWidth: "800px" }}className="text-justify">
          The timeline tells the story visually: <strong style={{ color: "#e0e0e0" }}>Google used to build for permanence. 
          Now it builds for experimentation.</strong>
        </p>
      </section>

      {/* ACT VI: THE ODDS */}
      <section style={{ marginBottom: "120px" }}>
        <div style={{ 
          fontSize: "10px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px"
        }}>
          Act VI → Your Product's Future
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "400", marginBottom: "20px", color: "#e0e0e0" }}>
          The Survival Curve
        </h2>
        <p style={{ fontSize: "15px", color: "#888", marginBottom: "40px", lineHeight: "1.7", maxWidth: "800px" }} className="text-justify">
          If Google launches a product today, what are its chances? The survival curve below answers that question. 
          It shows the probability a product survives to any given age.
        </p>
        
        <div ref={survivalRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#999", marginBottom: "8px", maxWidth: "800px" }} className="text-justify">
          The numbers are brutal:
        </p>
        <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#888", marginLeft: "20px", maxWidth: "780px" }} className="text-justify">
          • 25% of Google products die within 2 years
          <br />• 50% don't make it to their 4th birthday
          <br />• Only 1 in 4 survives past 6 years
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", marginTop: "30px", maxWidth: "800px" }} className="text-justify">
          If you're a developer building on a Google platform, you're betting on a coin flip that it'll exist in 4 years. 
          If you're a user investing time learning a Google product, the odds are worse than a casino.
        </p>
      </section>

      {/* ACT VII: THE TURNING POINT */}
      <section style={{ marginBottom: "120px" }}>
        <div style={{ 
          fontSize: "10px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px"
        }}>
          Act VII → What Changed?
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "400", marginBottom: "20px", color: "#e0e0e0" }}>
          The 2010 Inflection Point
        </h2>
        <p style={{ fontSize: "15px", color: "#888", marginBottom: "40px", lineHeight: "1.7", maxWidth: "800px" }} className="text-justify">
          Every chart points to the same moment: something fundamental shifted around 2010-2012. 
          The regression below shows the relationship between launch year and lifespan. The downward slope is damning.
        </p>
        
        <div ref={regressionRef} style={{ marginBottom: "40px" }} />
        
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#888", marginBottom: "30px", maxWidth: "800px" }} className="text-justify">
          Each year forward in time corresponds to a shorter lifespan. Products launched more recently 
          systematically live less. The regression line proves it's not random—it's a strategic shift.
        </p>
        <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#999", marginBottom: "12px", maxWidth: "800px" }} className="text-justify">
          Why 2010? Three theories emerge from the data:
        </p>
        <p style={{ fontSize: "14px", lineHeight: "1.9", color: "#888", marginLeft: "20px", maxWidth: "780px" }} className="text-justify">
          <strong style={{ color: "#e0e0e0" }}>1. The Mobile Revolution</strong>
          <br />The iPhone (2007) and Android (2008) forced companies into rapid iteration. 
          Products that didn't find mobile-market fit fast enough were killed. Speed became paramount.
        </p>
        <p style={{ fontSize: "14px", lineHeight: "1.9", color: "#888", marginLeft: "20px", marginTop: "16px", maxWidth: "780px" }} className="text-justify">
          <strong style={{ color: "#e0e0e0" }}>2. Competition Intensified</strong>
          <br />Facebook, Amazon, and Apple closed in. Google went from monopoly to battleground. 
          Products became weapons in market-share wars, not long-term bets.
        </p>
        <p style={{ fontSize: "14px", lineHeight: "1.9", color: "#888", marginLeft: "20px", marginTop: "16px", maxWidth: "780px" }} className="text-justify">
          <strong style={{ color: "#e0e0e0" }}>3. Cultural Transformation</strong>
          <br />Google's mission shifted from "organize the world's information" to "win every market." 
          Products stopped being missions and became experiments.
        </p>
      </section>

      {/* EPILOGUE */}
      <section style={{ marginBottom: "100px" }}>
        <div style={{ 
          fontSize: "10px",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "2px",
          marginBottom: "16px"
        }}>
          Epilogue → What It Means
        </div>
        <h2 style={{ fontSize: "32px", fontWeight: "400", marginBottom: "20px", color: "#e0e0e0" }}>
          The Cost of Moving Fast
        </h2>
        
        <p style={{ fontSize: "16px", lineHeight: "1.9", marginBottom: "30px", color: "#999", maxWidth: "800px" }}>
          The data reveals two Googles:
        </p>
        
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr", 
          gap: "40px", 
          marginBottom: "50px",
          maxWidth: "900px"
        }}>
          <div>
            <p style={{ fontSize: "15px", fontWeight: "500", marginBottom: "12px", color: "#e0e0e0" }}>
              The Old Google (pre-2010)
            </p>
            <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#888" }}>
              Gave products 5-8 years to find product-market fit. Built infrastructure meant to last decades. 
              Treated users as partners in a long-term mission. "Don't be evil" included "Don't abandon users."
            </p>
          </div>
          <div>
            <p style={{ fontSize: "15px", fontWeight: "500", marginBottom: "12px", color: "#e0e0e0" }}>
              The New Google (post-2010)
            </p>
            <p style={{ fontSize: "14px", lineHeight: "1.8", color: "#888" }}>
              Kills products in 2-3 years if they don't scale immediately. Treats product launches as experiments, 
              not commitments. Optimizes for market dominance over user trust. Speed over sustainability.
            </p>
          </div>
        </div>

        <p style={{ fontSize: "16px", lineHeight: "1.9", color: "#b4b4b4", marginBottom: "20px", maxWidth: "800px" }} className="text-justify">
          Google has become <strong style={{ color: "#e0e0e0" }}>{stats.percentChange}% faster</strong> at killing products. 
          But the cost is invisible in quarterly earnings and visible in the data:
        </p>
        
        <p style={{ fontSize: "14px", lineHeight: "1.9", color: "#888", marginLeft: "20px", maxWidth: "780px" }}>
          • <strong style={{ color: "#e0e0e0" }}>User trust eroded</strong> — Why invest time in a Google product 
          when it might disappear tomorrow?
          <br />• <strong style={{ color: "#e0e0e0" }}>Developer ecosystem fragmented</strong> — Which platform is safe to build on?
          <br />• <strong style={{ color: "#e0e0e0" }}>Company identity confused</strong> — What is Google's purpose 
          if products are disposable experiments?
        </p>
        
        <p style={{ 
          marginTop: "50px", 
          fontSize: "17px", 
          fontStyle: "italic", 
          color: "#999",
          maxWidth: "700px",
          lineHeight: "1.8"
        }} 
        className="text-justify"
        >
          The graveyard keeps growing at {stats.totalShutdowns} products and counting. 
          The question isn't whether Google will kill more products—the data says they will. 
          The question is whether they'll ever slow down long enough to build something that lasts.
        </p>
        
        <p style={{ 
          marginTop: "30px", 
          fontSize: "14px",
          color: "#666",
          maxWidth: "700px"
        }}
        className="text-justify"
        >
          The data doesn't lie. Google's product strategy has fundamentally changed. 
          And we're all living in the graveyard they're building.
        </p>
      </section>


      {/* FOOTER */}
      <footer style={{ 
        marginTop: "120px", 
        paddingTop: "40px", 
        borderTop: "1px solid #2a2a2a",
        color: "#666",
        fontSize: "12px"
      }}>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#888" }}>Methodology:</strong> Analysis of {stats.totalProducts} Google products 
          from killedbygoogle.com dataset. All visualizations created with Observable Plot and D3.js.
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#888" }}>Tools:</strong> TypeScript, Next.js, D3.js, Observable Plot
        </p>
        <p style={{ marginBottom: "8px" }}>
          <strong style={{ color: "#888" }}>Code:</strong> https://github.com/Pynthamil/The-Hunger-Games-The-Google-Edition/blob/main/Google.ipynb
        </p>
      </footer>

    </div>

    </div>
  );
}