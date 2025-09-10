# Vercel Deployment Guide for Secure Stride Log

This guide provides step-by-step instructions for deploying the Secure Stride Log application to Vercel.

## Prerequisites

- GitHub account with access to the `ameliaWhite92/secure-stride-log` repository
- Vercel account (free tier available)
- Node.js 18+ installed locally (for testing)

## Step 1: Prepare the Repository

1. Ensure all code is committed and pushed to the main branch
2. Verify the following files exist:
   - `package.json` with correct dependencies
   - `vite.config.ts` for build configuration
   - `index.html` as the entry point

## Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import the `ameliaWhite92/secure-stride-log` repository

## Step 3: Configure Project Settings

### Build Settings
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Environment Variables
Add the following environment variables in Vercel dashboard:

```
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_ALCHEMY_API_KEY=your_alchemy_api_key
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
VITE_CHAIN_ID=11155111
```

### Advanced Settings
- **Node.js Version**: 18.x
- **Build Command Override**: `npm run build`
- **Development Command**: `npm run dev`

## Step 4: Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Vercel will provide a deployment URL (e.g., `https://secure-stride-log-xxx.vercel.app`)

## Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Navigate to "Settings" > "Domains"
3. Add your custom domain
4. Configure DNS records as instructed by Vercel

## Step 6: Environment-Specific Configuration

### Production Environment
- Set `NODE_ENV=production`
- Ensure all environment variables are properly configured
- Test wallet connection functionality

### Preview Environment
- Automatically created for each pull request
- Uses the same environment variables as production
- Perfect for testing before merging

## Step 7: Monitoring and Analytics

1. Enable Vercel Analytics in project settings
2. Monitor deployment logs for any issues
3. Set up error tracking if needed

## Step 8: Continuous Deployment

Vercel automatically deploys when you push to the main branch:
1. Push changes to GitHub
2. Vercel detects the push
3. Automatically builds and deploys
4. Sends notification when deployment is complete

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check `package.json` dependencies
   - Verify Node.js version compatibility
   - Review build logs in Vercel dashboard

2. **Environment Variables**
   - Ensure all required variables are set
   - Check variable names match exactly
   - Verify no typos in values

3. **Wallet Connection Issues**
   - Verify WalletConnect Project ID
   - Check network configuration
   - Ensure contract address is correct

### Build Logs
Access build logs in Vercel dashboard:
1. Go to your project
2. Click on the deployment
3. View "Build Logs" tab

## Performance Optimization

1. **Enable Edge Functions** (if needed)
2. **Configure Caching** for static assets
3. **Optimize Images** using Vercel's image optimization
4. **Enable Compression** for better loading times

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **API Keys**: Use Vercel's environment variable system
3. **CORS**: Configure properly for wallet connections
4. **HTTPS**: Automatically enabled by Vercel

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Wallet connection works
- [ ] All pages are accessible
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Error tracking configured
- [ ] Analytics enabled

## Support

For issues with deployment:
1. Check Vercel documentation
2. Review GitHub repository issues
3. Contact Vercel support if needed

## Deployment URL

Once deployed, your application will be available at:
`https://secure-stride-log-xxx.vercel.app`

Replace `xxx` with your actual Vercel deployment identifier.

---

**Note**: This deployment guide assumes you have the necessary API keys and contract addresses. Make sure to obtain these before deployment.
