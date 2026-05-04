import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';
import { getProducts, getProductById } from '../services/productService';
import { getCategories } from '../services/categoryService';

export const skinRegistry = {
  // Icons (put first so explicitly defined ones override conflicts, e.g. Link)
  ...LucideIcons,

  // React
  React,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,

  // Router
  Link,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,

  // Contexts
  useAuth,
  useCart,
  useStore,

  // Services
  getProducts,
  getProductById,
  getCategories,
};
