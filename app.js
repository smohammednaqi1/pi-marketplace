document.addEventListener('DOMContentLoaded', () => {

    // --- OUR FAKE DATABASE ---
    // In a real app, this data would come from a server.
    // For our MVP, we just define it here.
    // You can add more products by copying the object format.
    // Use images from a free service like Unsplash or Pexels for now.
    const products = [
        {
            id: 'product-001',
            name: 'Vintage Leather Journal',
            description: 'A beautiful, handcrafted journal for your thoughts and ideas.',
            price: 5, // Price in Pi
            imageUrl: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            sellerWallet: 'GD...WALLET_1' // The seller's wallet address
        },
        {
            id: 'product-002',
            name: 'Wireless Bluetooth Earbuds',
            description: 'High-quality sound, long battery life. Perfect for music lovers.',
            price: 12.5, // Price in Pi
            imageUrl: 'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            sellerWallet: 'GB...WALLET_2' // Another seller's wallet
        },
        {
            id: 'product-003',
            name: 'Ceramic Coffee Mug',
            description: 'A sturdy and stylish mug for your morning coffee.',
            price: 2, // Price in Pi
            imageUrl: 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            sellerWallet: 'GC...WALLET_3' // A third seller's wallet
        }
    ];

    // --- COMMISSION LOGIC ---
    const MARKETPLACE_FEE_PERCENTAGE = 0.02; // 2% fee
    const MARKETPLACE_WALLET = 'GBUJCA4NE3WOP3UYVPIZXEYI55AFWMYJLOZK62MCJFJCCTJOHFWPE3JE'; // <<-- IMPORTANT: REPLACE WITH YOUR WALLET ADDRESS

    const productGrid = document.getElementById('product-grid');

    // Function to display all products on the page
    function displayProducts() {
        productGrid.innerHTML = ''; // Clear existing products
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                </div>
                <div class="product-footer">
                    <span class="product-price">${product.price} π</span>
                    <button class="buy-button" data-id="${product.id}">Buy Now</button>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // Function to handle the Pi Payment process
    async function handlePurchase(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            alert('Product not found!');
            return;
        }

        // Calculate fees
        const fee = product.price * MARKETPLACE_FEE_PERCENTAGE;
        const amountToSeller = product.price - fee;

        // The 'memo' helps you and the seller identify the transaction.
        const memo = `Purchase of ${product.name} from Pi Marketplace.`;

        // The payment details for the Pi SDK
        const paymentData = {
            // The list of payments to make.
            // One payment goes to the seller, one goes to you (the marketplace).
            recipient: product.sellerWallet,
            amount: amountToSeller,
            memo: memo,
            // This is how you take your commission!
            metadata: {
                marketplaceFee: fee,
                marketplaceWallet: MARKETPLACE_WALLET,
                productId: product.id
            }
        };

        const callbacks = {
            onReadyForServerAuth: (paymentId) => {
                // In a real app, you'd send this paymentId to your server to verify.
                // For our static MVP, we don't have a server, so we skip this.
                // We'll approve it on the client-side for demonstration.
                console.log('onReadyForServerAuth', paymentId);
                // On a real server you would call: Pi.approve(paymentId, { txid: '...' });
            },
            onReadyForServerCompletion: (paymentId, txid) => {
                // Same as above, you'd send this to your server to record the transaction.
                console.log('onReadyForServerCompletion', paymentId, txid);
                // On a real server you would call: Pi.complete(paymentId, { txid: '...' });
                alert(`Payment successful! TXID: ${txid}`);
            },
            onCancel: (paymentId) => {
                console.log('onCancel', paymentId);
                alert('Payment was cancelled.');
            },
            onError: (error, payment) => {
                console.log('onError', error);
                alert('An error occurred during payment.');
            },
        };

        try {
            // This opens the Pi payment screen for the user
            await Pi.requestPayment(paymentData, callbacks);
        } catch (err) {
            console.error(err);
            alert('Pi payment request failed.');
        }
    }

    // Add a single event listener to the grid to handle all button clicks
    productGrid.addEventListener('click', (event) => {
        if (event.target.classList.contains('buy-button')) {
            const productId = event.target.getAttribute('data-id');
            handlePurchase(productId);
        }
    });

    // Initial load of products
    displayProducts();
});