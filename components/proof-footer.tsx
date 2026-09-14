export function ProofFooter() {
  const tokenAddress = "0xaBabc7Ddc03e501d190C676BF3d92ef0e6e87a3C";

  return (
    <footer className="proof-footer">
      <div className="proof-footer__title">Proof on BOT Mainnet</div>
      <div className="proof-footer__grid">
        <div><span>Chain ID</span><strong>677</strong></div>
        <div><span>Registry Address</span><code>N/A - read-only application</code></div>
        <div><span>Reference Address</span><code>{tokenAddress}</code></div>
      </div>
      <div className="proof-footer__muted">Latest Receipt: N/A - no project-owned transaction</div>
    </footer>
  );
}
