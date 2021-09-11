import esbuild from "esbuild";

const isWatch = process.argv.includes("-w");

esbuild
  .build({
    entryPoints: ["src/index.tsx"],
    outdir: "./lib",
    bundle: true,
    sourcemap: isWatch ? true : false,
    minify: isWatch ? false : true,
    splitting: true,
    format: "esm",
    target: ["esnext"],
    watch: isWatch && {
      onRebuild(err) {
        err ? console.error("× Failed") : console.log("✓ Updated");
      },
    },
    define: {
      "process.env.NODE_ENV": isWatch ? '"development"' : '"production"',
    },
    tsconfig: "tsconfig.json",
  })
  .catch((error) => {
    console.log({ error });
    process.exit(1);
  });
