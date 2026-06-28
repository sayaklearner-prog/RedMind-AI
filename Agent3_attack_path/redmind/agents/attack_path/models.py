from pydantic import BaseModel, Field
from typing import List, Optional

class InitialAccess(BaseModel):
    asset: str
    type: str
    confidence: int

class AttackChain(BaseModel):
    id: str
    steps: List[str]
    description: str
    confidence: int
    evidence_references: List[str] = Field(default_factory=list)

class AssetRelationship(BaseModel):
    source: str
    relationship: str
    target: str
    evidence_references: List[str] = Field(default_factory=list)

class AttackPathSection(BaseModel):
    initial_access: List[InitialAccess] = Field(default_factory=list)
    attack_chains: List[AttackChain] = Field(default_factory=list)
    attack_vectors: List[str] = Field(default_factory=list)
    prerequisites: List[str] = Field(default_factory=list)
    affected_assets: List[str] = Field(default_factory=list)
    critical_assets: List[str] = Field(default_factory=list)
    asset_relationships: List[AssetRelationship] = Field(default_factory=list)
    trust_boundaries: List[str] = Field(default_factory=list)
    lateral_movement: List[str] = Field(default_factory=list)
    evidence_references: List[str] = Field(default_factory=list)
    attack_path_summary: str = ""
    confidence_score: int = 0
