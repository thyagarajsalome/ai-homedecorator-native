import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
// @ts-ignore
import { captureRef } from "react-native-view-shot";
import { LinearGradient } from "expo-linear-gradient";

interface ViralShareCardProps {
  beforeImage: string;
  afterImage: string;
  styleName: string;
}

export const ViralShareCard = React.forwardRef<any, ViralShareCardProps>(
  ({ beforeImage, afterImage, styleName }, ref) => {
    return (
      <View ref={ref} collapsable={false} style={styles.container}>
        {/* Top branding bar */}
        <LinearGradient
          colors={["#6366F1", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        >
          <Text style={styles.topBarText}>AI HOME DECORATOR</Text>
        </LinearGradient>

        {/* Before / After split */}
        <View style={styles.splitView}>
          <View style={styles.half}>
            <View style={[styles.halfLabel, { backgroundColor: "#6366F1" }]}>
              <Text style={styles.halfLabelText}>BEFORE</Text>
            </View>
            <Image source={{ uri: beforeImage }} style={styles.thumbnail} />
          </View>
          <View style={styles.divider} />
          <View style={styles.half}>
            <View style={[styles.halfLabel, { backgroundColor: "#D946EF" }]}>
              <Text style={styles.halfLabelText}>AFTER</Text>
            </View>
            <Image source={{ uri: afterImage }} style={styles.thumbnail} />
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>AI TRANSFORMED MY ROOM</Text>
          <Text style={styles.descriptionStyle}>Style: {styleName}</Text>
        </View>

        {/* Bottom CTA */}
        <LinearGradient
          colors={["#1E293B", "#0F172A"]}
          style={styles.bottomBar}
        >
          <Text style={styles.bottomTitle}>Design Your Dream Room in Seconds</Text>
          <Text style={styles.bottomSubtitle}>Download AI Home Decorator for free</Text>
          <View style={styles.ctaBox}>
            <Text style={styles.ctaText}>play.google.com/AiHomeDecorator</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
);
ViralShareCard.displayName = "ViralShareCard";

export const ShareButton: React.FC<{
  beforeImage: string;
  afterImage: string;
  styleName: string;
}> = ({ beforeImage, afterImage, styleName }) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const cardRef = React.useRef<any>(null);

  const captureAndShare = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      const uri = await captureRef(cardRef, {
        format: "jpg",
        quality: 1.0,
        result: "tmpfile",
      });

      const message = `Check out this amazing room I designed with AI!

Style: ${styleName}

Design your own dream home in seconds. Download AI Home Decorator for free:
https://play.google.com/store/apps/details?id=com.aihomedecorator.twa

#AIHomeDecorator #InteriorDesign #RoomMakeover`;

      if (Platform.OS === "web") {
        if (navigator.share) {
          const shareData: any = { text: message };
          if (uri && uri.startsWith("data:image/")) {
            try {
              const res = await fetch(uri);
              const blob = await res.blob();
              const file = new File([blob], "share_post.jpg", { type: "image/jpeg" });
              if (navigator.canShare && navigator.canShare({ files: [file] })) {
                shareData.files = [file];
              }
            } catch (fileErr) {
              console.error("Error creating file for share:", fileErr);
            }
          } else if (uri && (uri.startsWith("http://") || uri.startsWith("https://"))) {
            shareData.url = uri;
          }
          await navigator.share(shareData);
        } else {
          Alert.alert("Share", "Copy the link from the app!");
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const RNShare = require("react-native-share").default;
        await RNShare.open({
          title: "Share Your Dream Room",
          message,
          url: uri,
          type: "image/jpeg",
        });
      }
    } catch (err) {
      console.error("Share error:", err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View>
      <ViralShareCard
        ref={cardRef}
        beforeImage={beforeImage}
        afterImage={afterImage}
        styleName={styleName}
      />
      <TouchableOpacity
        onPress={captureAndShare}
        disabled={isCapturing}
        style={styles.shareBtn}
      >
        <LinearGradient
          colors={["#8B5CF6", "#D946EF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.shareBtnInner}
        >
          <Text style={styles.shareBtnText}>
            {isCapturing ? "Preparing..." : "Share as Post"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 600,
    height: 700,
    backgroundColor: "#0F172A",
  },
  topBar: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  topBarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
  splitView: {
    flexDirection: "row",
    flex: 1,
    padding: 16,
    gap: 12,
  },
  half: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  halfLabel: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 10,
  },
  halfLabelText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  divider: {
    width: 4,
    backgroundColor: "#334155",
  },
  descriptionContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  descriptionTitle: {
    color: "#F8FAFC",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: 1.5,
  },
  descriptionStyle: {
    color: "#94A3B8",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "600",
  },
  bottomBar: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  bottomTitle: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  bottomSubtitle: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 4,
    marginBottom: 10,
  },
  ctaBox: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  ctaText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  shareBtn: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
  },
  shareBtnInner: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  shareBtnText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
