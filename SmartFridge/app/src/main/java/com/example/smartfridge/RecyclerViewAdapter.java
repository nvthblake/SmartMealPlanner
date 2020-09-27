package com.example.smartfridge;

import android.content.Context;
import android.graphics.Bitmap;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;

import org.w3c.dom.Text;

public class RecyclerViewAdapter extends  RecyclerView.Adapter<RecyclerViewAdapter.ViewHolder> {

    private String[] nameEXP;
    private int[] imageEXP;
    private Context context;
    private Bitmap[] imageBP;
    private int[] imageNull;

    public RecyclerViewAdapter(String[] nameEXP, int[] imageEXP, Context context, Bitmap[] imageBP, int[] imageNull) {
        this.nameEXP = nameEXP;
        this.imageEXP = imageEXP;
        this.context = context;
        this.imageBP = imageBP;
        this.imageNull = imageNull;
    }
    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {

        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.ingr_card, parent, false);

        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {

//        holder.imageExp.setImageResource(imageEXP[position]);
        if (imageNull[position] == 0) {
            holder.imageExp.setImageBitmap(imageBP[position]);
        } else {
            holder.imageExp.setImageResource(imageEXP[position]);
        }
        holder.nameExp.setText(nameEXP[position]);
        holder.qtyText.setVisibility(View.GONE);

    }

    @Override
    public int getItemCount() {
        return nameEXP.length;
    }

    public class ViewHolder extends RecyclerView.ViewHolder{
        ImageView imageExp;
        TextView nameExp;
        TextView qtyText;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            imageExp = itemView.findViewById(R.id.empty_ingre);
            nameExp = itemView.findViewById(R.id.ingre_name);
            qtyText = itemView.findViewById(R.id.ingre_exp);
        }
    }
}
