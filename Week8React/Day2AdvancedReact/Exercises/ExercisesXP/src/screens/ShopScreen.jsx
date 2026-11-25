// This screen breaks on purpose so the ErrorBoundary around it is visible.
function ShopScreen() {
  throw new Error("The shop is closed today.");
}

export default ShopScreen;
