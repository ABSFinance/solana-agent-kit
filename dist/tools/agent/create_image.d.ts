import { SolanaAgentKit } from "../../index";
/**
 * Generate an image using OpenAI's DALL-E
 * @param agent SolanaAgentKit instance
 * @param prompt Text description of the image to generate
 * @param size Image size ('256x256', '512x512', or '1024x1024') (default: '1024x1024')
 * @param n Number of images to generate (default: 1)
 * @returns Object containing the generated image URLs
 */
export declare function create_image(agent: SolanaAgentKit, prompt: string, size?: "256x256" | "512x512" | "1024x1024", n?: number): Promise<{
    images: any[];
}>;
//# sourceMappingURL=create_image.d.ts.map