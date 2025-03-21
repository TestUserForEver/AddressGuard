🔒 AddressGuard
A custom Venn detector to block address poisoning attacks using deterministic similarity detection.

🚨 The Problem
Address poisoning is a simple but devastating scam:
Attackers send small transactions from lookalike addresses—hoping victims will accidentally copy/paste them into future transfers.
These fake addresses usually match the first and last characters of real ones, exploiting user trust and habits.
Losses in 23/24/25 alone exceeded millions, with significant incidents across Ethereum, Arbitrum, Polygon, and BNB Chain.

🧠 Our Solution
AddressGuard blocks these malicious transactions in real-time using:
✅ Prefix & Suffix Threshold Matching
✅ Levenshtein Distance Similarity Detection
✅ Probabilistic Modeling to Minimize False Positives
Instead of warning users, Venn allowed us to block the transaction deterministically — preventing damage before it happens.

🧪 Testing & Accuracy
We rigorously tested:
1m+ legitimate transactions → ✅ Not Blocked
1000+ poisoned addresses → 🚫 Blocked
Multiple edge cases → ✅ Passed
Heatmaps & probability tables showed natural collisions are mathematically near-impossible

📉 False Positives? Almost Impossible.
See Probability Table: https://drive.google.com/file/d/1o3iAvkffvd8mc8vTFCe8rkYZ81gvtKfW/view?usp=drive_link

Heatmap Visualizations showing just how unlikely it is for two legitimate addresses to match:
* Start and end with the same 4+ characters.
* Differ only slightly in the middle.
* Other scenarios.
https://drive.google.com/file/d/1LLlG4fiqRUXCiITsqY4JEw4LJtNu1UV5/view?usp=sharing

🧪 Technologies Used
TypeScript for custom detection logic
Venn Security Sandbox for testing
Levenshtein algorithm for pattern recognition
curl and mock TXs for live testing

🔗 Related Past Attacks
Blockaid: A Deep Dive into Address Poisoning
Chainalysis: The Address Poisoning Scam
Vitalik on Twitter: I almost lost funds to this

✅ Why It Matters
Most scams in Web3 require user mistakes. AddressGuard neutralizes one of the most deceptive ones—without needing user intervention.
This is a plug-and-play *and forget:) layer of proactive wallet defense, fully aligned with Venn’s block or allow architecture.

🧪 Example Tests

Legit TX (should not block):
curl -X POST http://localhost:3000/detect \
-H "Content-Type: application/json" \
-d '{
    "chainId": 1,
    "hash": "0x1111111111111111111111111111111111111111111111111111111111111111",
    "trace": {
        "from": "0xa2CAD9BAE0fA90f0c1D991CaEe4A9ea1d0137ad2",
        "to": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        "gas": "21000",
        "gasUsed": "21000",
        "input": "0x",
        "pre": {},
        "post": {}
    }
}' | jq .

Poisoned TX (should block):
curl -X POST http://localhost:3000/detect \
-H "Content-Type: application/json" \
-d '{
    "chainId": 1,
    "hash": "0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "trace": {
        "from": "0x1A2B3C45669a9FD93d5F28D9Ec85E40f4cb6DE78",
        "to": "0x1A2B3D45669a9FD93d5F28D9Ec85E40f4cb6DE78",
        "gas": "21000",
        "gasUsed": "21000",
        "input": "0x",
        "pre": {},
        "post": {}
    }
}' | jq .

🏁 Ready to Deploy? ;)

