import type { NextApiRequest, NextApiResponse } from "next";
import {
  DefenderRelaySigner,
  DefenderRelayProvider,
} from "defender-relay-client/lib/ethers";
import { ethers } from "ethers";
import { missionManagerAbi } from "../../hooks/abis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { walletAddress, missionId, score } = req.body;

  const credentials = {
    apiKey: process.env.OZ_RELAY_API_KEY as string,
    apiSecret: process.env.OZ_RELAY_API_SECRET as string,
  };
  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });

  const missionManagerContract = new ethers.Contract(
    process.env.MISSION_MANAGER_CONTRACT_ADDRESS as string,
    missionManagerAbi,
    signer
  );

  const response = await missionManagerContract[
    "updateMission(address,uint256,uint32)"
  ](walletAddress, missionId, score);

  res.status(200).json({ response });
}
