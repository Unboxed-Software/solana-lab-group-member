import { initializeKeypair, makeKeypairs } from "@solana-developers/helpers"
import { Cluster, Connection, clusterApiUrl } from "@solana/web3.js"
import dotenv from "dotenv"
// import { createGroup } from "./create-group" // We'll uncomment this later
// import { uploadOffChainMetadata } from "./helpers" // We'll uncomment this later
import { TokenMetadata } from "@solana/spl-token-metadata"
dotenv.config()

const CLUSTER: Cluster = "devnet"

/**
 * Create a connection and initialize a keypair if one doesn't already exists.
 * If a keypair exists, airdrop a sol if needed.
 */
const connection = new Connection(clusterApiUrl(CLUSTER))

const payer = await initializeKeypair(connection)

const decimals = 0
const maxMembers = 3

const [collectionMintKeypair] = makeKeypairs(1)

// CREATE COLLECTION METADATA

// UPLOAD OFF-CHAIN METADATA

// FORMAT TOKEN METADATA

// CREATE GROUP

// DEFINE MEMBER METADATA

// UPLOAD MEMBER METADATA AND CREATE MEMBER MINT
