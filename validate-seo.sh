#!/bin/bash

###############################################################################
# SEO Enhancement Validation Script
# 
# This script validates the SEO enhancements and AIoT integration
# implemented across the Ionity website.
#
# Usage: bash validate-seo.sh
###############################################################################

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         Ionity SEO Enhancement Validation Report              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counters
total_checks=0
passed_checks=0
failed_checks=0

# Function to run a check
check() {
    total_checks=$((total_checks + 1))
    local description=$1
    local command=$2
    local expected=$3
    
    result=$(eval "$command")
    
    if [ "$result" -ge "$expected" ]; then
        echo -e "${GREEN}✓${NC} $description: $result (Expected: ≥$expected)"
        passed_checks=$((passed_checks + 1))
    else
        echo -e "${RED}✗${NC} $description: $result (Expected: ≥$expected)"
        failed_checks=$((failed_checks + 1))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. AIoT KEYWORD INTEGRATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check "Pages with 'AIoT' keyword" "grep -l 'AIoT' *.html 2>/dev/null | wc -l" 11
check "Pages with 'Industrial AIoT'" "grep -l 'Industrial AIoT' *.html 2>/dev/null | wc -l" 5
check "AIoT in meta descriptions" "grep -l 'meta.*description.*AIoT' *.html 2>/dev/null | wc -l" 5

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. HREFLANG IMPLEMENTATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check "Pages with hreflang tags" "grep -l 'hreflang' *.html 2>/dev/null | wc -l" 11
check "Pages with en-ZA hreflang" "grep -l 'hreflang=\"en-ZA\"' *.html 2>/dev/null | wc -l" 11
check "Pages with x-default hreflang" "grep -l 'hreflang=\"x-default\"' *.html 2>/dev/null | wc -l" 11

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. CANONICAL LINKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check "Pages with canonical links" "grep -l 'rel=\"canonical\"' *.html 2>/dev/null | wc -l" 11

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. STRUCTURED DATA (JSON-LD)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check "Pages with Organization schema" "grep -l '\"@type\": \"Organization\"' *.html 2>/dev/null | wc -l" 1
check "Pages with FAQPage schema" "grep -l '\"@type\": \"FAQPage\"' *.html 2>/dev/null | wc -l" 1
check "FAQ Questions about AIoT" "grep -c 'What is AIoT' index.html 2>/dev/null" 1

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. META TAGS & SEO BASICS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check "Pages with meta description" "grep -l '<meta name=\"description\"' *.html 2>/dev/null | wc -l" 11
check "Pages with meta keywords" "grep -l '<meta name=\"keywords\"' *.html 2>/dev/null | wc -l" 11
check "Pages with robots meta" "grep -l '<meta name=\"robots\"' *.html 2>/dev/null | wc -l" 11

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. FILES & RESOURCES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "assets/js/seo-enhancement.js" ]; then
    echo -e "${GREEN}✓${NC} SEO Enhancement Script exists"
    passed_checks=$((passed_checks + 1))
else
    echo -e "${RED}✗${NC} SEO Enhancement Script missing"
    failed_checks=$((failed_checks + 1))
fi
total_checks=$((total_checks + 1))

if [ -f "sitemap.xml" ]; then
    echo -e "${GREEN}✓${NC} Sitemap.xml exists"
    passed_checks=$((passed_checks + 1))
else
    echo -e "${RED}✗${NC} Sitemap.xml missing"
    failed_checks=$((failed_checks + 1))
fi
total_checks=$((total_checks + 1))

if [ -f "robots.txt" ]; then
    echo -e "${GREEN}✓${NC} robots.txt exists"
    passed_checks=$((passed_checks + 1))
else
    echo -e "${RED}✗${NC} robots.txt missing"
    failed_checks=$((failed_checks + 1))
fi
total_checks=$((total_checks + 1))

if [ -f "SEO-AIOT-IMPLEMENTATION-SUMMARY.md" ]; then
    echo -e "${GREEN}✓${NC} Documentation exists"
    passed_checks=$((passed_checks + 1))
else
    echo -e "${RED}✗${NC} Documentation missing"
    failed_checks=$((failed_checks + 1))
fi
total_checks=$((total_checks + 1))

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. SITEMAP VALIDATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
check "URLs in sitemap" "grep -c '<loc>' sitemap.xml 2>/dev/null" 10
check "Recent lastmod dates (2026)" "grep -c '2026-02-17' sitemap.xml 2>/dev/null" 8

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                         SUMMARY                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Total Checks: $total_checks"
echo -e "${GREEN}Passed: $passed_checks${NC}"
echo -e "${RED}Failed: $failed_checks${NC}"
echo ""

if [ $failed_checks -eq 0 ]; then
    echo -e "${GREEN}✓ All SEO enhancements validated successfully!${NC}"
    echo ""
    echo "Next Steps:"
    echo "1. Submit sitemap to Google Search Console"
    echo "2. Test structured data: https://search.google.com/test/rich-results"
    echo "3. Validate schema: https://validator.schema.org/"
    echo "4. Monitor AIoT keyword performance"
    exit 0
else
    echo -e "${YELLOW}⚠ Some checks failed. Please review the issues above.${NC}"
    exit 1
fi
