#!/usr/bin/env python3
"""
Test script to verify that the main.py can be imported without errors.
This is useful for CI/CD pipelines to check if all dependencies are working.
"""

import sys
import os

def test_imports():
    try:
        print("Testing basic imports...")
        import fastapi
        import uvicorn
        from PIL import Image
        print("✓ Basic imports successful")
        
        # Test transformers import (optional)
        try:
            import transformers
            import torch
            print("✓ ML dependencies available")
        except ImportError as e:
            print(f"⚠ ML dependencies not available: {e}")
        
        print("\nTesting main.py import...")
        import main
        print("✓ main.py imported successfully")
        
        print("\nTesting API endpoints...")
        print(f"✓ FastAPI app created: {main.app}")
        print(f"✓ QA Pipeline status: {'Loaded' if main.qa_pipeline else 'Not loaded (fallback mode)'}")
        print(f"✓ Disease Classifier status: {'Loaded' if main.disease_classifier else 'Not loaded (fallback mode)'}")
        
        return True
        
    except Exception as e:
        print(f"✗ Import failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)