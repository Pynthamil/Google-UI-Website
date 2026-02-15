"use client"

import Link from "next/link";

import { CodeBlock, CodeBlockCopyButton } from "@/components/ai/code-block";
import { DotPattern } from "@/components/ui/dot-pattern";

import { Github } from "lucide-react"
import { Button } from "@/components/ui/button";

const codeBlocks = [

  {
    title: "Installing Required Libraries",
    code: `!pip install joypy

!pip install pytrends`
  },

  {
    title: "Importing Necessary Libraries & Setting Theme",
    code: `#import necessary libraries
import pandas as pd
import numpy as np
import joypy
import matplotlib.pyplot as plt
import warnings
warnings.filterwarnings("ignore")
import seaborn as sns

sns.set_theme(style="whitegrid", palette="summer")`
  },

  {
    title: "Fetching Google Trends Data",
    code: `from pytrends.request import TrendReq

pytrends = TrendReq()
pytrends.build_payload(["social media", "smartphone", "cloud computing", "streaming", "AI"],
                       timeframe="2004-01-01 2023-12-31"
                       )

trends = pytrends.interest_over_time()
trends = trends.drop(columns=["isPartial"])

trends.head()

trends.tail()`
  },

  {
    title: "Downloading Dataset from Kaggle",
    code: `import kagglehub

# Download latest version
path = kagglehub.dataset_download("nharshavardhana/killed-by-google-google-graveyard")

print("Path to dataset files:", path)`
  },

  {
    title: "Loading and Inspecting Dataset",
    code: `#data preparation
#1. Loading dataset
df = pd.read_csv("/kaggle/input/killed-by-google-google-graveyard/Google_graveyard.csv")

#take a look at the data
df.head()

df.tail()

#list the number of rows and columns
rows, columns = df.shape

print("The rows are: ", rows)
print("The columns are: ", columns)`
  },

  {
    title: "Launch Year vs Lifespan (Regression Plot)",
    code: `#checking the launch year vs lifespan
plt.figure(figsize=(10,6))

sns.regplot(
    data=df,
    x="Start",
    y="Total years",
)

plt.title("Has Google’s tolerance for product failure increased over time?")
plt.xlabel("Launch Year")
plt.ylabel("Product Lifespan (years)")

plt.show()`
  },

  {
    title: "Launch Year vs Lifespan (Hexbin Density)",
    code: `import matplotlib.pyplot as plt

plt.figure(figsize=(8, 6))

plt.hexbin(
    df["Start"],
    df["Total years"],
    cmap="summer",
    gridsize=25,
)

plt.colorbar(label="Number of Products")

plt.xlabel("Launch Year")
plt.ylabel("Lifespan (Years)")
plt.title("Did the era a product was born in influence how long it lived?")
plt.show()`
  },

  {
    title: "Distribution of Lifespans by Category (Joyplot)",
    code: `# Distribution of Total Years (Lifespans) by Category
plt.figure(figsize=(10, 6))

joypy.joyplot(
    data=df,
    column='Total years',
    by='Category',
    colormap=plt.cm.summer_r,
    alpha=0.6
)

plt.title('Which categories of Google products are most likely to be discontinued?')
plt.xlabel('Lifespan')
plt.ylabel('Density')
plt.grid(True)
plt.show()`
  },

  {
    title: "Average Lifespan by Launch Year",
    code: `# Average Google Product Lifespan by Launch Year

avg_lifespan = df.groupby("Start")["Total years"].mean().reset_index()


plt.figure(figsize=(10, 6))
plt.plot(
    avg_lifespan["Start"],
    avg_lifespan["Total years"],
    marker="o"
)
plt.title("Has the average lifespan of Google products declined over time?")
plt.xlabel("Launch Year")
plt.ylabel("Average Lifespan (Years)")
plt.grid(True)

plt.show()`
  },

  {
    title: "Category Counts & Shutdown Frequency",
    code: `category_counts = df['Category'].value_counts()
category_counts

shutdowns = df["End"].value_counts().sort_index()

plt.figure(figsize=(10, 6))

plt.bar(shutdowns.index, shutdowns.values)

plt.title("When Did Google Shut Down the Most Products?")
plt.xlabel("Shutdown Year")
plt.ylabel("Number of Products")

plt.show()`
  },

  {
    title: "Active Products Per Year",
    code: `years = range(df["Start"].min(), df["End"].max() + 1)
active_products_per_year = []

for year in years:
    active_products = df[(df["Start"] <= year) & (df["End"] >= year)]
    active_products_per_year.append(len(active_products))

plt.figure(figsize=(10, 6))
plt.plot(years, active_products_per_year, marker='o')
plt.title("Is Google’s ecosystem becoming more crowded or shrinking? ")
plt.xlabel("Year")
plt.ylabel("Number of Active Products")
plt.grid(True)
plt.show()`
  },

  {
    title: "Product Launches Over Time",
    code: `# Google Product Launches Over Time

launch_counts = df["Start"].value_counts().sort_index()

plt.figure(figsize=(10,6))

plt.plot(
    launch_counts.index,
    launch_counts.values,
    marker="o"
)

plt.title("Has Google been experimenting more aggressively over time?")
plt.xlabel("Year")
plt.ylabel("Number of New Products")
plt.grid(True)

plt.show()`
  },

  {
    title: "Aggregating Google Trends by Year",
    code: `# Count Trends per Year
trends["year"] = trends.index.year

trends_yearly = (
    trends.groupby("year")
    .mean()
    .reset_index()
)

trends_yearly.head()`
  },

  {
    title: "Shutdown Counts Per Year",
    code: `# Count shutdowns per Year

shutdowns = df["End"].value_counts().sort_index()

shutdowns = shutdowns.reset_index()
shutdowns.columns = ["year", "shutdown_count"]

shutdowns.head()`
  },

  {
    title: "Merging Culture Trends with Shutdown Data",
    code: `merged = trends_yearly.merge(
    shutdowns,
    on="year",
    how="left"
)

merged["shutdown_count"] = merged["shutdown_count"].fillna(0)

merged.head()`
  },

  {
    title: "Internet Culture vs Google Shutdowns",
    code: `# Internet Culture vs Google Shutdowns
culture_cols = ["social media", "smartphone", "cloud computing", "streaming", "AI"]

fig, axes = plt.subplots(
    2, 3,
    figsize=(18,10),
    sharex=True,
    sharey=True
)

axes = axes.flatten()

for ax, col in zip(axes, culture_cols):

    ax.bar(
        merged["year"],
        merged["shutdown_count"],
        alpha=0.3,
    )

    ax.set_title(col)

    ax2 = ax.twinx()
    ax2.plot(
        merged["year"],
        merged[col],
        linewidth=2
    )

# remove unused subplot (6th box)
fig.delaxes(axes[-1])

axes[0].set_ylabel("Shutdowns")

plt.suptitle("How have shifts in internet culture influenced the shutdown of Google's products?", fontsize=16)
plt.tight_layout()
plt.show()`
  },

  {
    title: "Correlation Heatmap: Culture vs Shutdowns",
    code: `corr_matrix = merged.corr(numeric_only=True)

plt.figure(figsize=(8,6))

sns.heatmap(
    corr_matrix,
    annot=True,
    center=0,
    cmap="summer",
)

plt.title("Correlation: Internet Culture vs Google Shutdowns")
plt.show()`
  }

]


export default function Colab() {
  return (
    <div className="relative h-full w-full overflow-hidden">

      <div className="relative bg-white">

        {/* Header Row */}
        <div className="flex items-center justify-between p-3 bg-white">
            <h2 className="font-bold">The Code From My Notebook</h2>

            <Link
            href="https://github.com/Pynthamil/The-Hunger-Games-The-Google-Edition/blob/main/Google.ipynb"
            target="_blank"
            >
            <Button variant="outline" size="sm">
                <Github className="mr-2 h-4 w-4" />
                Open in Github
            </Button>
            </Link>
        </div>

        {/* Gradient Bottom Border */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#fde68a] via-[#fca5a5] via-[#c4b5fd] via-[#93c5fd] to-[#86efac]" />


      </div>

      
      <DotPattern
            className="absolute inset-0 -z-10 opacity-40"
      />
      
      <div className="w-full max-w-2xl p-8 mx-auto">

        {codeBlocks.map((block, index) => (
          <div key={block.title ?? index} className="relative mb-24">

            {/* Soft Outer Glow */}
            <div
              className="
                absolute -inset-1 rounded-3xl
    bg-[conic-gradient(from_180deg_at_50%_50%,#c58f00,#b3261e,#6b21a8,#1e3a8a,#166534,#c58f00)]
    blur-xl opacity-15
              "
            />

            {/* Thin Gradient Border */}
            <div
              className="
                absolute inset-0 rounded-2xl"
            >
              <div className="absolute inset-0 rounded-2xl
      bg-[conic-gradient(from_180deg_at_50%_50%,#c58f00,#b3261e,#6b21a8,#1e3a8a,#166534,#c58f00)]" />
            </div>

            {/* Card */}
            <div className="relative rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="text-lg font-semibold mb-3">
                {block.title}
              </h2>

              <CodeBlock
                code={block.code}
                language="python"
              >
                <CodeBlockCopyButton
                  onCopy={() => console.log("Copied code to clipboard")}
                  onError={() => console.error("Failed to copy code to clipboard")}
                />
              </CodeBlock>

            </div>
          </div>
        ))}

      </div>
    </div>
  )
}