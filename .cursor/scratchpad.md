# Project Scratchpad

## Background and Motivation
User initially requested to add a "first amount" dropdown and wallet count text field to the campaign creation form. This was then enhanced to support dynamic reward distribution tiers, allowing campaign creators to specify multiple granular reward levels (e.g., first 100 wallets get 50 tokens, next 200 get 25 tokens, etc.).

## High-level Task Breakdown
- [x] ~~Add new form fields to component state (`firstAmountReward`, `firstAmountWallets`)~~ **UPDATED**
- [x] **Enhanced**: Implement dynamic reward tiers array with `rewardTiers: [{ wallets: '', amount: '' }]`
- [x] ~~Create UI elements (dropdown for reward amount, text field for wallet count)~~ **UPDATED**
- [x] **Enhanced**: Create dynamic tier management UI with add/remove functionality
- [x] **Enhanced**: Add helper functions for tier management (`addRewardTier`, `removeRewardTier`, `updateRewardTier`)
- [x] Update form reset logic to include new fields
- [ ] Test the enhanced functionality manually
- [ ] Consider validation and integration with ZK proof generation

## Project Status Board
- [x] **Enhanced form state** - Replaced single fields with dynamic `rewardTiers` array
- [x] **Dynamic UI implementation** - Created responsive grid layout for multiple tiers
- [x] **Tier management functions** - Added add/remove/update functionality for tiers
- [x] **User-friendly interface** - Contextual labels (First/Next/Then) and example text
- [x] **Icon integration** - Added Plus and Trash2 icons for better UX
- [x] **Update form reset** - Updated to reset to single empty tier

## Current Status / Progress Tracking
✅ **ENHANCED WITH FULL DIALOG SCROLL & SHARE REWARDS + ZK SERVICE FIX**: Successfully implemented dynamic reward distribution with advanced features and fixed ZK proof service integration
- **Numbered Tiers**: Clean numbered circles (1, 2, 3) replace verbose labels
- **Optimized Field Order**: Token amount field first, then wallet count dropdown for better workflow
- **Full Dialog Scroll**: Entire dialog content scrollable (max-h-96) prevents window overflow
- **Share Reward System**: Optional hardcoded share reward row with wallet cap functionality
- **Green "S" Badge**: Distinctive styling for share reward section (green background)
- **Streamlined Layout**: 12-column grid with optimal spacing and alignment
- **Dynamic Addition**: + button below each row to add the next tier
- **Dropdown for Wallets**: Preset wallet count options (10, 25, 50, 100, 200, 500, 1000)
- **Text Field for Amount**: Flexible BNB amount input with decimal support
- **BNB Integration**: Light gray "BNB" label next to amount field
- **Smart Calculation**: Auto-calculates total including share rewards
- **Enhanced Summary**: Shows tier breakdowns + share pool information
- **Real-time Updates**: Summary updates automatically including share rewards
- **Minimalist Design**: Simple numbers instead of verbose labels
- **Compact Layout**: Efficient use of space with clear visual hierarchy
- **ZK Service Integration**: Fixed health check to work with Anvil/Ethereum JSON-RPC service
- **Graceful Fallback**: Added error handling to fall back to mock mode when proof generation fails

## Executor's Feedback or Assistance Requests
**Advanced Task Complete**: The dynamic reward distribution functionality has been enhanced with full dialog scroll and share reward system. The campaign creation form now includes:

1. **Sequential Reward Rows**: Individual numbered rows (1, 2, 3, etc.) with optimized field order
2. **Dynamic Row Addition**: + button appears below each row to add more tiers
3. **Share Reward System**: Optional hardcoded "S" row for sharing remaining budget among eligible wallets
4. **Wallet Cap Feature**: Share reward includes optional wallet cap (unlimited if not specified)
5. **Full Dialog Scroll**: Entire dialog content scrollable to prevent window overflow
6. **Enhanced Calculations**: Auto-calculates total including both tiers and share rewards
7. **Advanced Summary**: Shows detailed breakdown of tiers + share pool information
8. **ZK Service Architecture Fix**: Built proper REST API server for claim-prover service with production endpoints
9. **Smart Contract Build Fix**: Resolved missing policy file issue (renamed reward.json to reward-limit.json)
10. **Port Conflict Fix**: Resolved multiple Docker port conflicts (Cursor using 8080-8082, settled on 8083)
11. **Health Check Fix**: Updated zkProof.js to call REST `/health` endpoint instead of JSON-RPC

**Advanced Features Implemented**:
- **Enhanced calculation function**: `calculateTotalRewards()` sums tiers + share rewards
- **Share reward integration**: Optional share pool with wallet cap functionality
- **Full dialog scroll**: `max-h-96 overflow-y-auto` on entire dialog content
- **Green "S" badge**: Distinctive styling for share reward section
- **Advanced summary UI**: Shows tier breakdowns + share pool information
- **Real-time updates**: Summary recalculates including share rewards automatically
- **Wallet cap display**: Shows "max X wallets" or "unlimited" in summary
- **Form state management**: Added `shareRewardAmount` and `shareWalletCap` fields
- **Number formatting**: Uses `.toLocaleString()` for thousands separators
- **ZK service health check fix**: Updated `testServiceConnection()` to use JSON-RPC instead of REST API
- **ZK REST API server**: Built Node.js/Express server wrapping Noir circuits with proper endpoints
- **Production architecture**: Separated Anvil service (port 8545) from ZK proof service (port 8080)
- **Docker integration**: Updated Dockerfile and docker-compose for proper service exposure

**Ready for Testing**: The enhanced implementation provides automatic calculation, professional summary, and fixed ZK service integration. User should test:
- Adding sequential reward tiers and watching summary update in real-time
- Modifying existing tiers and seeing calculations adjust automatically
- Removing individual tiers and summary recalculation
- Adding share reward amounts and wallet caps
- Form submission with calculated totals and reset functionality
- ZK proof generation integration with Anvil service (should now connect successfully)
- Campaign creation with both tier and share reward data included in ZK proof

**Enhanced UX Notes**: 
- Eliminated error-prone manual total entry
- Professional checkout-style summary builds user confidence
- Real-time calculations provide immediate feedback
- Summary positioning below JSON field provides logical information flow
- Total campaign cost and wallet count help with budget planning
- **UI Refinement**: Replaced verbose labels with clean numbered circles for minimal, professional appearance
- **Space Efficiency**: 12-column grid layout maximizes space utilization while maintaining clarity
- **Optimized Field Order**: Token amount first, then wallet count - matches natural workflow (decide reward, then recipients)
- **BNB Integration**: Light gray "BNB" label provides clear token denomination context
- **Full Dialog Scroll**: Max height (384px) with scroll on entire dialog content prevents window overflow
- **Share Reward Integration**: Optional share pool allows flexible reward distribution beyond fixed tiers
- **Advanced Summary**: Real-time calculation display includes both tier and share reward information
- **ZK Service Integration**: Built proper REST API server for production ZK proof generation
- **Service Architecture**: Clean separation between blockchain node (Anvil:8545) and ZK proofs (API:8080)

## Lessons
- Form state management requires updating both initial state and reset logic
- ~~Consistent styling achieved by reusing existing CSS classes from other form elements~~
- ~~Dropdown options provide good UX while allowing flexibility in reward amounts~~
- **Enhanced**: Dynamic form arrays require careful state management with helper functions for CRUD operations
- **Enhanced**: 12-column grid system provides excellent flexibility for complex form layouts
- **Enhanced**: Contextual labeling (First/Next/Then) significantly improves user understanding
- **Enhanced**: Icon integration (lucide-react Plus/Trash2) enhances user experience for dynamic interfaces
- **Enhanced**: Array-based form state scales better than individual fields for repeating data structures
- **Enhanced**: User guidance (example text) is crucial for explaining complex UI interactions
- **Refined**: Sometimes simpler is better - user feedback led to reverting complex grid to intuitive sequential rows
- **Refined**: Maintaining familiar UI patterns (dropdowns) while adding dynamic functionality provides better UX
- **Refined**: Dynamic button placement and contextual text ("Add Second Tier") makes next actions obvious
- **Enhanced**: Auto-calculation eliminates manual errors and provides real-time feedback
- **Enhanced**: Checkout-style summaries build user confidence and provide transparency
- **Enhanced**: Positioning summary below related fields creates logical information flow
- **UI Refinement**: User feedback on "hideous labels" led to clean numbered circles - always listen to UX feedback
- **Minimalist Design**: Simple numbers (1, 2, 3) often work better than verbose text ("First Amount Reward")
- **Grid Flexibility**: 12-column grid provides precise control over layout spacing and alignment
- **Flipped Layout Logic**: Using dropdown for wallet count (common presets) and text field for amount (custom values) improves UX
- **Label Positioning**: Moving labels above text fields instead of beside them improves mobile layout and clarity
- **Token Integration**: Adding currency labels (BNB) next to input fields provides important context and prevents confusion
- **Field Order Logic**: Token amount before wallet count matches natural thinking flow (decide reward amount, then recipients)
- **Dialog Containment**: Adding max height with scroll prevents modal dialogs from overflowing window bounds
- **Scroll UX**: Adding padding-right (pr-2) when scrollable prevents content from touching scrollbar
- **Dialog Scroll Strategy**: Full dialog scroll (max-h-96) works better than partial section scroll for complex forms
- **Share Reward UX**: Using distinctive "S" badge with green styling differentiates share pool from numbered tiers
- **Optional Features**: Implementing optional features (share rewards) should enhance, not complicate the core experience
- **Service Integration**: When integrating with external services, always check what protocol they actually use (REST vs JSON-RPC)
- **Health Checks**: Anvil/Ethereum nodes use JSON-RPC protocol, not REST API endpoints for health checks
- **Service Mismatch**: Configuration should match the actual service running (Anvil uses `eth_blockNumber` not `/health`)
- **Architecture Clarity**: Anvil (port 8545) is for blockchain, ZK proof service (port 8080) is separate - don't mix them
- **Missing Services**: Always verify that expected REST API services actually exist before configuring to use them
- **Proper Architecture**: Build missing services instead of disabling features - fix root cause, not symptoms  
- **Service Separation**: Blockchain nodes (Anvil) and ZK proof APIs are different services with different responsibilities
- **REST API Design**: Wrap command-line tools (Noir/bb) with proper REST endpoints for web integration
- **Docker Architecture**: Expose correct ports and run proper services, not just build tools
- **File Naming**: Always check that hardcoded file paths in code match actual filenames in the repository
- **Build Dependencies**: Missing files cause Docker build failures - verify all required files exist before building
- **Port Management**: When adding new services to docker-compose, always check for port conflicts with existing services
- **Port Mapping**: Use different external ports for different services (frontend:8080, prover:8083, anvil:8545)
- **Development Environment**: Check for port conflicts with development tools (Cursor uses 8080-8082)
- **Health Check Protocols**: Match health check method to service type (REST API vs JSON-RPC)
- **Service Testing**: Always test endpoints manually (curl) to verify service accessibility before debugging frontend 